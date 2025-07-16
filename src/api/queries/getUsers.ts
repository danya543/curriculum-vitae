import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers {
    users {
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
