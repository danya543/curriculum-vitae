import { gql } from "@apollo/client";

export const GET_SKILLS = gql`
  query GetSkills {
  skills {
    id
    created_at
    name
    category {
      id
      name
    }
    category_name
    category_parent_name
  }
}
`;
