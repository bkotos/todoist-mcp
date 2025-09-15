import { listProjects, ProjectsResponse } from './projects/projects';
import {
  isBrianOnlyProject,
  isBrianSharedProject,
  isBeckySharedProject,
  isInboxProject,
  getErrorMessage,
} from '../utils';

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
