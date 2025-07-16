import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
// import { refreshToken } from './token'
import { redirect } from 'react-router-dom'

import { getAccessToken, removeTokens } from '@/components/constants'

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

const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.extensions?.code === 'UNAUTHENTICATED') {
                /* return fromPromise(refreshToken())
                .filter(Boolean)
                .flatMap(newAccessToken => {
                    operation.setContext(({ headers = {} }) => ({
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    }))

                    return forward(operation)
                }) */
                removeTokens();
                window.location.href = '/auth/login'
                redirect('/auth/login')
                return
            }
        }
    }
})

export const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
})
