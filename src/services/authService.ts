import { client } from '@/api/client';
import { LOGIN, SIGNUP } from '@/api/mutations/auth';
import { setId, setTokens } from '@/components/constants';

export const login = async (auth: { email: string; password: string }) => {
    const { data } = await client.mutate({
        mutation: LOGIN,
        variables: { auth },
    })

    if (data?.login) {
        setTokens(data.login.access_token, data.login.refresh_token)
        setId(data.login.user.id)
        return data.login.user
    }

    throw new Error('Login failed')
}

export const signup = async (auth: { email: string; password: string }) => {
    const { data } = await client.mutate({
        mutation: SIGNUP,
        variables: { auth },
    })

    if (data?.signup) {
        localStorage.setItem('access_token', data.signup.access_token)
        localStorage.setItem('refresh_token', data.signup.refresh_token)
        return data.signup.user
    }

    throw new Error('Signup failed')
}