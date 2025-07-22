import { gql } from "@apollo/client";

export const GET_PROFILE_LANGUAGES = gql`
  query ProfileLanguages($userId: ID!) {
    profile(userId: $userId) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;
