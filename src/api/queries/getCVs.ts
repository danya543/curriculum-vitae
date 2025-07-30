import { gql } from "@apollo/client";

export const GET_CVS = gql`
  query GetCVs {
    cvs {
      id
      created_at
      name
      education
      description
      user {
        id
        email
      }
    }
  }
`;
