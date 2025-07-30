import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      created_at
      name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`;
