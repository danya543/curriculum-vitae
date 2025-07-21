export const getAccessToken = () => { return localStorage.getItem('access_token') }
export const getRefreshToken = () => { return localStorage.getItem('refresh_token') }
export const getId = () => {
    return localStorage.getItem('user_id') ?? null
}

export const setTokens = (access: string, refresh: string): void => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
}
export const setId = (id: string) => {
    localStorage.setItem('user_id', id)
}

export const removeTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_id')
}

export const langLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];