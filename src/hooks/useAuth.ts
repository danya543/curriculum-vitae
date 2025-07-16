export const useAuth = () => {
    const accessToken = localStorage.getItem('access_token')
    return { isAuthenticated: !!accessToken }
}
