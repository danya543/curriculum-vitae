import { gql } from '@apollo/client';

export const DELETE_CV = gql`
  mutation DeleteCv($input: DeleteCvInput!) {
    deleteCv(input: $input) {
      success
      message
      deletedCvId
    }
  }
`;
