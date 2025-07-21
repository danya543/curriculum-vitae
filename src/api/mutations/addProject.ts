import { gql } from '@apollo/client';

export const ADD_CV_PROJECT = gql`
  mutation AddCvProject($input: AddCvProjectInput!) {
    addCvProject(project: $input) {
      id
      name
      description
    }
  }
`;
