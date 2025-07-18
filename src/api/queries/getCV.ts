import { gql } from "@apollo/client";

export const GET_CV = gql`
  query GetCV($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      created_at
      name
      education
      description
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
