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

    const filteredProjects = allProjects.projects.filter((project) => {
      switch (project.name) {
        case 'Areas of focus':
        case 'Inbox':
        case 'Media':
        case 'Musings':
        case 'Next actions':
        case 'Contextual':
        case 'Projects':
        case 'Calendar':
        case 'Tickler':
        case 'Someday':
        case 'Waiting':
        case 'Chores':
        case 'Graveyard':
        case 'Graveyard - read':
        case 'Graveyard - watch':
          return true;
        default:
          return false;
      }
    });

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

    const filteredProjects = allProjects.projects.filter((project) => {
      switch (project.name) {
        case 'Brian inbox - per Becky':
        case 'Brian acknowledged':
        case 'Brian projects':
        case 'Brian waiting':
        case 'Brian someday':
        case 'Brian tickler':
        case 'Brian contextual':
          return true;
        default:
          return false;
      }
    });

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

    const filteredProjects = allProjects.projects.filter((project) => {
      switch (project.name) {
        case 'Becky someday':
        case 'Becky inbox - per Brian':
        case 'Becky acknowledged':
        case 'Becky In Progress':
          return true;
        default:
          return false;
      }
    });

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

    const filteredProjects = allProjects.projects.filter((project) => {
      switch (project.name) {
        case 'Inbox':
        case 'Brian inbox - per Becky':
        case 'Becky inbox - per Brian':
          return true;
        default:
          return false;
      }
    });

    return {
      projects: filteredProjects,
      total_count: filteredProjects.length,
    };
  } catch (error) {
    throw new Error(`Failed to get inbox projects: ${getErrorMessage(error)}`);
  }
}
