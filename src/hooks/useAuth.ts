export const useAuth = () => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('user_role')
    return {
        isAuthenticated: !!accessToken,
        id: userId,
        role: userRole,
        accessToken,
        refreshToken
    }
}
