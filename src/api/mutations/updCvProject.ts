import { gql } from '@apollo/client';

export const UPDATE_CV_PROJECT = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
      name
      description
      projects {
        id
        name
        internal_name
        description
        domain
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
