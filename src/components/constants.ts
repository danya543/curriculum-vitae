export const setTokens = (access: string, refresh: string): void => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
}
export const setInfo = (id: string, role: string) => {
    localStorage.setItem('user_id', id)
    localStorage.setItem('user_role', role)
}

export const removeTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_id')
}

export const redInputSx = {
    '& label.Mui-focused': { color: '#C63031' },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': { borderColor: '#C63031' },
    },
};