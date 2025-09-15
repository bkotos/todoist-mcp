import { ProjectNames } from './project-names';
import { TodoistProject } from '../types';

// Check if a project is a Brian-only project (not shared)
export function isBrianOnlyProject(project: TodoistProject): boolean {
  switch (project.name) {
    case ProjectNames.AREAS_OF_FOCUS:
    case ProjectNames.INBOX:
    case ProjectNames.MEDIA:
    case ProjectNames.MUSINGS:
    case ProjectNames.NEXT_ACTIONS:
    case ProjectNames.CONTEXTUAL:
    case ProjectNames.PROJECTS:
    case ProjectNames.CALENDAR:
    case ProjectNames.TICKLER:
    case ProjectNames.SOMEDAY:
    case ProjectNames.WAITING:
    case ProjectNames.CHORES:
    case ProjectNames.GRAVEYARD:
    case ProjectNames.GRAVEYARD_READ:
    case ProjectNames.GRAVEYARD_WATCH:
      return true;
    default:
      return false;
  }
}

// Check if a project is a Brian shared project (for tasks in his ballpark to handle per Becky)
export function isBrianSharedProject(project: TodoistProject): boolean {
  switch (project.name) {
    case ProjectNames.BRIAN_INBOX_PER_BECKY:
    case ProjectNames.BRIAN_ACKNOWLEDGED:
    case ProjectNames.BRIAN_PROJECTS:
    case ProjectNames.BRIAN_WAITING:
    case ProjectNames.BRIAN_SOMEDAY:
    case ProjectNames.BRIAN_TICKLER:
    case ProjectNames.BRIAN_CONTEXTUAL:
    case ProjectNames.BRIAN_TIME_SENSITIVE:
      return true;
    default:
      return false;
  }
}

// Check if a project is a Becky shared project (for tasks in her ballpark to handle per Brian)
export function isBeckySharedProject(project: TodoistProject): boolean {
  switch (project.name) {
    case ProjectNames.BECKY_SOMEDAY:
    case ProjectNames.BECKY_INBOX_PER_BRIAN:
    case ProjectNames.BECKY_ACKNOWLEDGED:
    case ProjectNames.BECKY_IN_PROGRESS:
    case ProjectNames.BECKY_TIME_SENSITIVE:
      return true;
    default:
      return false;
  }
}

// Check if a project is an inbox project
export function isInboxProject(project: TodoistProject): boolean {
  switch (project.name) {
    case ProjectNames.INBOX:
    case ProjectNames.BRIAN_INBOX_PER_BECKY:
    case ProjectNames.BECKY_INBOX_PER_BRIAN:
      return true;
    default:
      return false;
  }
}
