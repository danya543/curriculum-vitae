import { gql } from '@apollo/client'

export const LOGIN = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      user {
        id
        email
      }
      access_token
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user {
        id
        email
      }
      access_token
    }
  }
`;