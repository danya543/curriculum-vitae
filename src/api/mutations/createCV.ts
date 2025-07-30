import { gql } from "@apollo/client";

export const CREATE_CV = gql`
  mutation CreateCv($input: CreateCvInput!) {
    createCv(cv: $input) {
      id
      created_at
      name
      education
      description
      user {
        id
        email
        profile {
          first_name
          last_name
          full_name
        }
        department_name
        position_name
        role
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
