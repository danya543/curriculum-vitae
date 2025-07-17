import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      id
      email
      created_at
      is_verified
      role
      profile {
        first_name
        last_name
      }
      department {
        id
        name
      }
      department_name
      position {
        id
        name
      }
      position_name
      cvs {
        id
        created_at
      }
    }
  }
`
