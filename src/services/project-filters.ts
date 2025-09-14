import { listProjects, ProjectsResponse } from './projects/projects';
import {
  isBrianOnlyProject,
  isBrianSharedProject,
  isBeckySharedProject,
  isInboxProject,
} from '../utils';

// Get error message
function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

// Helper function to format project list
function formatProjectList(projects: any[], categoryName: string): string {
  if (projects.length === 0) {
    return `No ${categoryName} projects found.`;
  }

  const formattedProjects = projects
    .map((project) => `- ${project.name} (${project.url})`)
    .join('\n');

  return `Found ${projects.length} ${categoryName} project(s):\n\n${formattedProjects}`;
}

// Get Brian-only projects (not shared)
export async function getBrianOnlyProjects(): Promise<ProjectsResponse> {
  try {
    const allProjects = await listProjects();

    const filteredProjects = allProjects.projects.filter(isBrianOnlyProject);

    return {
      projects: filteredProjects,
      total_count: filteredProjects.length,
    };
  } catch (error) {
    throw new Error(
      `Failed to get Brian-only projects: ${getErrorMessage(error)}`
    );
  }
}

// Get Brian shared projects (for tasks in his ballpark to handle per Becky)
export async function getBrianSharedProjects(): Promise<ProjectsResponse> {
  try {
    const allProjects = await listProjects();

    const filteredProjects = allProjects.projects.filter(isBrianSharedProject);

    return {
      projects: filteredProjects,
      total_count: filteredProjects.length,
    };
  } catch (error) {
    throw new Error(
      `Failed to get Brian shared projects: ${getErrorMessage(error)}`
    );
  }
}

// Get Becky shared projects (for tasks in her ballpark to handle per Brian)
export async function getBeckySharedProjects(): Promise<ProjectsResponse> {
  try {
    const allProjects = await listProjects();

    const filteredProjects = allProjects.projects.filter(isBeckySharedProject);

    return {
      projects: filteredProjects,
      total_count: filteredProjects.length,
    };
  } catch (error) {
    throw new Error(
      `Failed to get Becky shared projects: ${getErrorMessage(error)}`
    );
  }
}

// Get inbox projects (the three inbox-related projects)
export async function getInboxProjects(): Promise<ProjectsResponse> {
  try {
    const allProjects = await listProjects();

    const filteredProjects = allProjects.projects.filter(isInboxProject);

    return {
      projects: filteredProjects,
      total_count: filteredProjects.length,
    };
  } catch (error) {
    throw new Error(`Failed to get inbox projects: ${getErrorMessage(error)}`);
  }
}
