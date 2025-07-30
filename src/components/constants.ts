import type { ApolloError } from "@apollo/client"

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

export const MenuPropsSx = {
    PaperProps: {
        style: { maxHeight: 300, },
        sx: {
            '& .MuiMenuItem-root.Mui-selected': {
                backgroundColor: 'rgba(198, 48, 49, 0.1)',
                color: 'rgb(198, 48, 49)',
                '&:hover': {
                    backgroundColor: 'rgba(198, 48, 49, 0.2)',
                },
            },
        },
    },
}

export const levelColors: Record<string, string> = {
    A1: "#f44336",
    A2: "#e57373",
    B1: "#ff9800",
    B2: "#ffb74d",
    C1: "#4caf50",
    C2: "#81c784",
    Native: '#c63031',
};

export const usersColumns = [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
] as const;


export const getApolloErrorMessage = (e: ApolloError) => {
    const gqlMsg = e.graphQLErrors?.[0]?.message;
    if (gqlMsg) return gqlMsg;

    const networkMsg =
        // @ts-expect-error - networkError 
        e.networkError?.result?.errors?.[0]?.message ||
        e.networkError?.message;

    return networkMsg || e.message || 'Unknown error';
};