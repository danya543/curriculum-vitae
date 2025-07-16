import { getRefreshToken, setTokens } from "@/components/constants"

export const refreshToken = async (): Promise<string | null> => {
    const refresh_token = getRefreshToken()

    if (!refresh_token) return null

    try {
        const res = await fetch('https://cv-project-js.inno.ws/api/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refresh_token}`,
            },
            body: JSON.stringify({
                query: `
                    mutation UpdateToken {
                        updateToken {
                            access_token
                            refresh_token
                        }
                    }
                `,
            }),
        })

        const { data } = await res.json()
        const tokens = data?.updateToken

        if (tokens?.access_token && tokens?.refresh_token) {
            setTokens(tokens.access_token, tokens.refresh_token)
            return tokens.access_token
        }

        return null
    } catch (error) {
        console.error('Failed to refresh token:', error)
        return null
    }
}
