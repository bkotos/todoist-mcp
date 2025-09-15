import { getTodoistClient } from '../client';
import { TodoistTask } from '../../types';

function getErrorMessage(error: any): string {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function getTasksDueThisWeek(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const filter =
      'next 7 days & (!##Tickler) & (!##Ansonia Tickler) & (!##Project - Meal prep) & ' +
      '(!shared | assigned to: Brian | ##Brian inbox - per Becky | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list) & ' +
      '(!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & ' +
      '!##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & ' +
      '!##CarPreparation & !##Food & !##Before Hospital Stay)';

    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get tasks due this week: ${getErrorMessage(error)}`
    );
  }
}
