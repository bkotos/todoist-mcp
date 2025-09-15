import { updateTask } from './task-updates';
import { createAutomatedTaskComment } from './comments';
import { moveTask } from './move-task';
import { listProjects } from '../projects/projects';
import { getErrorMessage } from '../../utils';

// Helper function to find project by name
async function findProjectByName(projectName: string): Promise<string> {
  const projects = await listProjects();
  const project = projects.projects.find((p) => p.name === projectName);

  if (!project) {
    throw new Error(`Project "${projectName}" not found`);
  }

  return project.id.toString();
}

// Helper function to build the comment content
function buildCommentContent(): string {
  return `I finished this task. If it looks good to you, please mark as complete. Otherwise, put back in my inbox.`;
}

/**
 * Complete a task assigned to Brian from Becky by:
 * 1. Setting the due date to today
 * 2. Adding a comment about completion
 * 3. Moving the task to "Becky inbox - per Brian" project
 */
export async function completeBeckyTask(taskId: string): Promise<void> {
  try {
    const commentContent = buildCommentContent();

    // Find the Becky inbox project
    const beckyInboxProjectId = await findProjectByName(
      'Becky inbox - per Brian'
    );

    // Update the task due string to today
    await updateTask({
      taskId,
      dueString: 'today',
    });

    // Add the completion comment
    await createAutomatedTaskComment(taskId, commentContent);

    // Move the task to the Becky inbox project
    await moveTask(taskId, beckyInboxProjectId);
  } catch (error) {
    throw new Error(`Failed to complete Becky task: ${getErrorMessage(error)}`);
  }
}
