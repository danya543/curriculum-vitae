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
      languages {
        name
        proficiency
      }
      skills {
        name
        categoryId
        mastery
      }
      projects {
        id
        project {
            id
            created_at
            name
            internal_name
            domain
            start_date
            end_date
            description
            environment
        }
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
      }
    }
  }
`;
