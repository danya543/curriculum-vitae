export const getAccessToken = () => localStorage.getItem('access_token')
export const getRefreshToken = () => localStorage.getItem('refresh_token')

export const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
}

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
          mutation Refresh {
            refresh {
              access_token
              refresh_token
            }
          }
        `,
            }),
        })

        const { data } = await res.json()
        if (data?.refresh?.access_token) {
            setTokens(data.refresh.access_token, data.refresh.refresh_token)
            return data.refresh.access_token
        }

        return null
    } catch (error) {
        console.error('Failed to refresh token:', error)
        return null
    }
}
