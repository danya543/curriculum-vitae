import { gql } from '@apollo/client';

export const REMOVE_CV_PROJECT = gql`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
      name
      projects {
        id
        name
      }
    }
  }
`;
