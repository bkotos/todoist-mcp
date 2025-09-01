import { getTodoistClient } from './client';

interface TodoistProject {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  comment_count: number;
  is_shared: boolean;
  is_favorite: boolean;
  is_inbox_project: boolean;
  is_team_inbox: boolean;
  view_style: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface ProjectsResponse {
  projects: Array<{
    id: number;
    name: string;
    url: string;
    is_favorite: boolean;
    is_inbox: boolean;
  }>;
  total_count: number;
}

// Get error message
function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

// Helper function to transform Todoist projects to our format
function transformProjects(projects: TodoistProject[]): ProjectsResponse {
  const transformedProjects = projects.map((project) => ({
    id: parseInt(project.id),
    name: project.name,
    url: project.url,
    is_favorite: project.is_favorite,
    is_inbox: project.is_inbox_project,
  }));

  return {
    projects: transformedProjects,
    total_count: transformedProjects.length,
  };
}

// Get GTD projects using the specified filter
export async function getGtdProjects(): Promise<ProjectsResponse> {
  try {
    const client = getTodoistClient();
    const filter =
      '(#Projects | #Brian projects | #Ansonia Projects) & !subtask & (!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & !##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & !##CarPreparation & !##Food & !##Before Hospital Stay)';

    const response = await client.get<TodoistProject[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );

    return transformProjects(response.data);
  } catch (error) {
    throw new Error(`Failed to get GTD projects: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistProject, ProjectsResponse };
