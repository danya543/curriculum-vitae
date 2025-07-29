import { gql } from '@apollo/client';

export const GET_CV_PROJECTS = gql`
  query GetCv($cvId: ID!) {
    cv(id: $cvId) {
      id
      name
      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
        project {
          id
          name
        }
      }
    }
  }
`;
