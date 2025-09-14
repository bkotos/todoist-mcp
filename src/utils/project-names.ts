// Brian shared project names (projects shared with Becky)
export enum BrianSharedProjectNames {
  BRIAN_INBOX_PER_BECKY = 'Brian inbox - per Becky',
  BRIAN_ACKNOWLEDGED = 'Brian acknowledged',
  BRIAN_PROJECTS = 'Brian projects',
  BRIAN_WAITING = 'Brian waiting',
  BRIAN_SOMEDAY = 'Brian someday',
  BRIAN_TICKLER = 'Brian tickler',
  BRIAN_CONTEXTUAL = 'Brian contextual',
  BRIAN_TIME_SENSITIVE = 'Brian time sensitive (per Becky)',
}

// Becky shared project names (projects shared with Brian)
export enum BeckySharedProjectNames {
  BECKY_SOMEDAY = 'Becky someday',
  BECKY_INBOX_PER_BRIAN = 'Becky inbox - per Brian',
  BECKY_ACKNOWLEDGED = 'Becky acknowledged',
  BECKY_IN_PROGRESS = 'Becky In Progress',
  BECKY_TIME_SENSITIVE = 'Becky time sensitive (per Brian)',
}

// Brian non-shared project names (Brian's personal projects)
export enum BrianNonSharedProjectNames {
  INBOX = 'Inbox',
  AREAS_OF_FOCUS = 'Areas of focus',
  MEDIA = 'Media',
  SHOPPING_LIST = 'Shopping list',
  MUSINGS = 'Musings',
  NEXT_ACTIONS = 'Next actions',
  CONTEXTUAL = 'Contextual',
  PROJECTS = 'Projects',
  CALENDAR = 'Calendar',
  TICKLER = 'Tickler',
  SOMEDAY = 'Someday',
  WAITING = 'Waiting',
  CHORES = 'Chores',
  GRAVEYARD = 'Graveyard',
  GRAVEYARD_READ = 'Graveyard - read',
  GRAVEYARD_WATCH = 'Graveyard - watch',
}

// Combined enum for backward compatibility and convenience
export const ProjectNames = {
  ...BrianSharedProjectNames,
  ...BeckySharedProjectNames,
  ...BrianNonSharedProjectNames,
} as const;
