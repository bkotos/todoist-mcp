import { ProjectNames } from '../../utils';

// Baby project exclusion filter - used across multiple functions
export const BABY_PROJECTS_EXCLUSION = [
  '(!##BABY',
  '& !###BrianBabyFocus',
  '& !##Home Preparation',
  '& !##Cards',
  '& !##Hospital Preparation',
  '& !##Baby Care Book',
  '& !##To Pack',
  '& !##Hospital Stay',
  '& !##Post Partum',
  '& !##Questions and Concerns',
  '& !##Research',
  '& !##BabyClassNotes',
  '& !##CarPreparation',
  '& !##Food',
  '& !##Before Hospital Stay)',
].join(' ');

// Define the filter query for better readability
export const DUE_TODAY_FILTER = [
  '(today | overdue)',
  '& !##Tickler',
  '& !##Brian tickler',
  '& !##Ansonia Tickler',
  '& !##Someday',
  '& !##Brian someday',
  '& !##Brian inbox - per Becky',
  '& !##Becky inbox - per Brian',
  '& !##Shopping list',
  '& !##Becky acknowledged',
  '& !##Chores',
  '& !##rent',
  `& ${BABY_PROJECTS_EXCLUSION}`,
  '& !##Daily Chores',
  '& !##Baby Research',
  '& !##Becky someday',
].join(' ');

// Define the filter query for better readability
export const WAITING_FILTER = '#Waiting | #Brian waiting | #Ansonia Waiting';

// Define the filter query for better readability
export const RECENT_MEDIA_FILTER = `##${ProjectNames.MEDIA} & !subtask & (created after: 30 days ago) & !@watched`;

// Tomorrow filter - complex filter for tasks due tomorrow
export const TOMORROW_FILTER = [
  'tomorrow',
  '& (!##Tickler)',
  '& (!##Chores)',
  '& (!##Brian tickler)',
  '& (!##Ansonia Tickler)',
  '& (!##Project - Meal prep)',
  '& (!shared | assigned to: Brian | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list)',
  `& ${BABY_PROJECTS_EXCLUSION}`,
].join(' ');

// This week filter - complex filter for tasks due this week
export const THIS_WEEK_FILTER = [
  'next 7 days & (!##Tickler) & (!##Ansonia Tickler) & (!##Project - Meal prep) &',
  '(!shared | assigned to: Brian | ##Brian inbox - per Becky | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list) &',
  BABY_PROJECTS_EXCLUSION,
].join(' ');
