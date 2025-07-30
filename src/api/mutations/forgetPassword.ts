import { gql } from '@apollo/client'

import { client } from '../client'


const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(auth: { email: $email })
  }
`

export const forgotPassword = async (email: string) => {
    return await client.mutate({
        mutation: FORGOT_PASSWORD,
        variables: { email },
    })
}
