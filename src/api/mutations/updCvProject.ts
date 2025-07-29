import { gql } from '@apollo/client';

export const UPDATE_CV_PROJECT = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
      name
      description
      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
        project {
          id
          name
        }
      }
    }
  }
`;

/* // Использование:
const [updateCvProject] = useMutation(UPDATE_CV_PROJECT);

// Пример вызова:
updateCvProject({
  variables: {
    project: {
      id: "PROJECT_ID", // обязательно
      name: "Updated Name",
      internal_name: "Internal Name",
      description: "Updated Description",
      domain: "Banking",
      start_date: "2023-01-01",
      end_date: "2024-01-01",
      environment: ["React", "Node.js"],
      roles: ["Frontend Developer"],
      responsibilities: ["Developed UI components"]
    }
  }
});
 */