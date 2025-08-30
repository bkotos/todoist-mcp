import { listProjects, ProjectsResponse } from './projects';

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

    const brianOnlyProjectNames = [
      'Areas of focus',
      'Inbox',
      'Media',
      'Musings',
      'Next actions',
      'Contextual',
      'Projects',
      'Calendar',
      'Tickler',
      'Someday',
      'Waiting',
      'Chores',
      'Graveyard',
      'Graveyard - read',
      'Graveyard - watch',
    ];

    const filteredProjects = allProjects.projects.filter((project) =>
      brianOnlyProjectNames.includes(project.name)
    );

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

    const brianSharedProjectNames = [
      'Brian inbox - per Becky',
      'Brian acknowledged',
      'Brian projects',
      'Brian waiting',
      'Brian someday',
      'Brian tickler',
      'Brian contextual',
    ];

    const filteredProjects = allProjects.projects.filter((project) =>
      brianSharedProjectNames.includes(project.name)
    );

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

    const beckySharedProjectNames = [
      'Becky someday',
      'Becky inbox - per Brian',
      'Becky acknowledged',
      'Becky In Progress',
    ];

    const filteredProjects = allProjects.projects.filter((project) =>
      beckySharedProjectNames.includes(project.name)
    );

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
