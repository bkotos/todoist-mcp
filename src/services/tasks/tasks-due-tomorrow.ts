import { getTodoistClient } from '../client';
import { TodoistTask } from '../../types';
import { getErrorMessage } from '../../utils';

export async function getTasksDueTomorrow(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const filter = [
      'tomorrow',
      '& (!##Tickler)',
      '& (!##Chores)',
      '& (!##Brian tickler)',
      '& (!##Ansonia Tickler)',
      '& (!##Project - Meal prep)',
      '& (!shared | assigned to: Brian | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list)',
      '& (!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & !##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & !##CarPreparation & !##Food & !##Before Hospital Stay)',
    ].join(' ');

    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get tasks due tomorrow: ${getErrorMessage(error)}`
    );
  }
}
