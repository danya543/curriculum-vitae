import { gql } from "@apollo/client";

export const ADD_CV_SKILL = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      skills {
        name
        mastery
        categoryId
      }
    }
  }
`;
