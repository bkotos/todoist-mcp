import axios, { AxiosInstance } from 'axios';

interface TodoistTask {
  id: string;
  content: string;
  description: string;
  project_id: string;
  section_id?: string;
  parent_id?: string;
  order: number;
  labels: string[];
  priority: number;
  due?: {
    date: string;
    string: string;
    datetime?: string;
    timezone?: string;
  };
  url: string;
  comment_count: number;
  created_at: string;
  updated_at: string;
  assignee_id?: string;
  assigner_id?: string;
}

interface TodoistProject {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  comment_count: number;
  is_shared: boolean;
  is_favorite: boolean;
  is_inbox_project: boolean;
  is_team_inbox: boolean;
  view_style: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface CreateTaskParams {
  content: string;
  project_id?: string;
  due_string?: string;
  priority?: number;
  labels?: string[];
}

interface UpdateTaskParams {
  content?: string;
  due_string?: string;
  priority?: number;
  labels?: string[];
}

export class TodoistService {
  private client: AxiosInstance;
  private defaultProjectIds: string[];

  constructor() {
    const apiToken = process.env.TODOIST_API_TOKEN;
    if (!apiToken) {
      throw new Error('TODOIST_API_TOKEN environment variable is required');
    }

    this.client = axios.create({
      baseURL: 'https://api.todoist.com/rest/v2',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Parse default project IDs from environment
    const inboxProjectIds = process.env.INBOX_PROJECT_IDS;
    this.defaultProjectIds = inboxProjectIds ? inboxProjectIds.split(',').map(id => id.trim()) : [];
  }

  async listInboxTasks(projectIds?: string[]): Promise<string> {
    try {
      const targetProjectIds = projectIds || this.defaultProjectIds;
      
      if (targetProjectIds.length === 0) {
        // If no specific project IDs, get all tasks
        const response = await this.client.get<TodoistTask[]>('/tasks');
        return this.formatTasksList(response.data);
      }

      // Get tasks for specific projects
      const allTasks: TodoistTask[] = [];
      for (const projectId of targetProjectIds) {
        const response = await this.client.get<TodoistTask[]>(`/tasks`, {
          params: { project_id: projectId }
        });
        allTasks.push(...response.data);
      }

      return this.formatTasksList(allTasks);
    } catch (error) {
      throw new Error(`Failed to list inbox tasks: ${this.getErrorMessage(error)}`);
    }
  }

  async createTask(params: CreateTaskParams): Promise<string> {
    try {
      const response = await this.client.post<TodoistTask>('/tasks', {
        content: params.content,
        project_id: params.project_id,
        due_string: params.due_string,
        priority: params.priority,
        labels: params.labels,
      });

      return `Task created successfully!\n\n${this.formatTask(response.data)}`;
    } catch (error) {
      throw new Error(`Failed to create task: ${this.getErrorMessage(error)}`);
    }
  }

  async updateTask(taskId: string, params: UpdateTaskParams): Promise<string> {
    try {
      const response = await this.client.post<TodoistTask>(`/tasks/${taskId}`, {
        content: params.content,
        due_string: params.due_string,
        priority: params.priority,
        labels: params.labels,
      });

      return `Task updated successfully!\n\n${this.formatTask(response.data)}`;
    } catch (error) {
      throw new Error(`Failed to update task: ${this.getErrorMessage(error)}`);
    }
  }

  async closeTask(taskId: string): Promise<string> {
    try {
      await this.client.post(`/tasks/${taskId}/close`);
      return `Task ${taskId} closed successfully!`;
    } catch (error) {
      throw new Error(`Failed to close task: ${this.getErrorMessage(error)}`);
    }
  }

  async listProjects(): Promise<string> {
    try {
      const response = await this.client.get<TodoistProject[]>('/projects');
      return this.formatProjectsList(response.data);
    } catch (error) {
      throw new Error(`Failed to list projects: ${this.getErrorMessage(error)}`);
    }
  }

  private formatTasksList(tasks: TodoistTask[]): string {
    if (tasks.length === 0) {
      return 'No tasks found.';
    }

    const formattedTasks = tasks.map(task => this.formatTask(task)).join('\n\n');
    return `Found ${tasks.length} task(s):\n\n${formattedTasks}`;
  }

  private formatTask(task: TodoistTask): string {
    const priorityEmoji = ['', '🔴', '🟡', '🟢', '⚪'][task.priority] || '⚪';
    const dueInfo = task.due ? `\n📅 Due: ${task.due.string}` : '';
    const labelsInfo = task.labels.length > 0 ? `\n🏷️ Labels: ${task.labels.join(', ')}` : '';
    
    return `${priorityEmoji} **${task.content}** (ID: ${task.id})${dueInfo}${labelsInfo}\n🔗 URL: ${task.url}`;
  }

  private formatProjectsList(projects: TodoistProject[]): string {
    if (projects.length === 0) {
      return 'No projects found.';
    }

    const formattedProjects = projects.map(project => {
      const inboxIndicator = project.is_inbox_project ? ' 📥' : '';
      return `**${project.name}** (ID: ${project.id})${inboxIndicator}\n🔗 URL: ${project.url}`;
    }).join('\n\n');

    return `Found ${projects.length} project(s):\n\n${formattedProjects}`;
  }

  private getErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error || error.message;
    }
    return error instanceof Error ? error.message : 'Unknown error';
  }
}

