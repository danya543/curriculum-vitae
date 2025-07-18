import { gql } from '@apollo/client';

export const UPDATE_CV = gql`
  mutation UpdateCv($input: UpdateCvInput!) {
    updateCv(cv: $input) {
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
