// Project type matching the structure used in ProjectsResponse
interface Project {
  id: number;
  name: string;
  url: string;
  is_favorite: boolean;
  is_inbox: boolean;
}

// Check if a project is a Brian-only project (not shared)
export function isBrianOnlyProject(project: Project): boolean {
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
}

// Check if a project is a Brian shared project (for tasks in his ballpark to handle per Becky)
export function isBrianSharedProject(project: Project): boolean {
  switch (project.name) {
    case 'Brian inbox - per Becky':
    case 'Brian acknowledged':
    case 'Brian projects':
    case 'Brian waiting':
    case 'Brian someday':
    case 'Brian tickler':
    case 'Brian contextual':
    case 'Brian time sensitive (per Becky)':
      return true;
    default:
      return false;
  }
}

// Check if a project is a Becky shared project (for tasks in her ballpark to handle per Brian)
export function isBeckySharedProject(project: Project): boolean {
  switch (project.name) {
    case 'Becky someday':
    case 'Becky inbox - per Brian':
    case 'Becky acknowledged':
    case 'Becky In Progress':
    case 'Becky time sensitive (per Brian)':
      return true;
    default:
      return false;
  }
}

// Check if a project is an inbox project
export function isInboxProject(project: Project): boolean {
  switch (project.name) {
    case 'Inbox':
    case 'Brian inbox - per Becky':
    case 'Becky inbox - per Brian':
      return true;
    default:
      return false;
  }
}
