import { gql } from '@apollo/client';

export const ADD_CV_PROJECT = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
      name
      description
    }
  }
`;
