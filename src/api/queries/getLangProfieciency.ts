import { gql } from "@apollo/client";

export const GET_PROFICIENCY_LEVELS = gql`
  query GetProficiencyLevels {
    __type(name: "Proficiency") {
      enumValues {
        name
      }
    }
  }
`;