import { gql } from "@apollo/client";

export const UPDATE_CV_SKILL = gql`
    mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
        updateCvSkill(skill: $skill) {
            id
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;
