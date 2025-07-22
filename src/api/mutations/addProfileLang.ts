import { gql } from "@apollo/client";

export const ADD_PROFILE_LANGUAGE = gql`
  mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      created_at
      first_name
      last_name
      full_name
      avatar
      skills {
        name
        mastery
      }
      languages {
        name
        proficiency
      }
    }
  }
`;
