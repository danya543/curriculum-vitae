import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query GetPositions {
  positions {
    id
    created_at
    name
  }
}
`;
