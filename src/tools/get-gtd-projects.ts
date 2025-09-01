import { getGtdProjects } from '../services/get-gtd-projects';

export async function getGtdProjectsTool() {
  try {
    return await getGtdProjects();
  } catch (error) {
    throw new Error(
      `Failed to get GTD projects: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// MCP Tool Schema
export const getGtdProjectsSchema = {
  name: 'get_gtd_projects',
  description:
    'Get GTD projects filtered by the specified Todoist filter: (#Projects | #Brian projects | #Ansonia Projects) & !subtask & (!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & !##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & !##CarPreparation & !##Food & !##Before Hospital Stay)',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// MCP Tool Handler
export async function getGtdProjectsHandler(): Promise<{
  content: Array<{ type: 'text'; text: string }>;
}> {
  console.error('Executing get_gtd_projects...');
  const result = await getGtdProjectsTool();
  console.error('get_gtd_projects completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
