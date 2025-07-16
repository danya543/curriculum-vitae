export const getRefreshToken = (): string | null => {
    const token = localStorage.getItem('refresh_token')
    return token && token.trim() !== '' ? token : null
}
export const setTokens = (access: string, refresh: string): void => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
}

export const getAccessToken = () => localStorage.getItem('access_token')

export const removeTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}