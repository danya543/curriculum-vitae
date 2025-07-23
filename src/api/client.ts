import {
    ApolloClient,
    createHttpLink,
    from,
    fromPromise,
    InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { UPDATE_TOKEN } from '@/api/mutations/updToken'
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
} from '@/components/constants'

const httpLink = createHttpLink({
    uri: 'https://cv-project-js.inno.ws/api/graphql',
})

const authLink = setContext((_, { headers }) => {
    const token = getAccessToken()
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    }
})

let isRefreshing = false
let pendingRequests: (() => void)[] = []

const resolvePendingRequests = () => {
    pendingRequests.forEach(callback => callback())
    pendingRequests = []
}

const tokenClient = new ApolloClient({
    link: setContext((_, { headers }) => {
        const refreshToken = getRefreshToken()
        return {
            headers: {
                ...headers,
                Authorization: refreshToken ? `Bearer ${refreshToken}` : '',
            },
        }
    }).concat(httpLink),
    cache: new InMemoryCache(),
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        const unauthenticated = graphQLErrors.some(
            err => err.extensions?.code === 'UNAUTHENTICATED'
        )

        if (unauthenticated) {
            if (!isRefreshing) {
                isRefreshing = true

                return fromPromise(
                    tokenClient
                        .mutate({ mutation: UPDATE_TOKEN })
                        .then(response => {
                            const tokens = response.data?.updateToken
                            if (!tokens?.access_token || !tokens?.refresh_token) {
                                throw new Error('No tokens returned')
                            }
                            setTokens(tokens.access_token, tokens.refresh_token)
                            resolvePendingRequests()
                            return tokens.access_token
                        })
                        .catch(error => {
                            console.error('[Refresh token failed]', error)
                            return null
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                )
                    .filter((token): token is string => Boolean(token))
                    .flatMap(newAccessToken => {
                        operation.setContext(({ headers = {} }) => ({
                            headers: {
                                ...headers,
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }))
                        return forward(operation)
                    })
            } else {
                return fromPromise(
                    new Promise<void>(resolve => {
                        pendingRequests.push(() => resolve())
                    })
                ).flatMap(() => forward(operation))
            }
        }
    }

    if (networkError) {
        console.error('[Network error]', networkError)
    }
})

export const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
})
