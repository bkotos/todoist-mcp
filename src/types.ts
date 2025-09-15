export interface TodoistTask {
  id: string;
  project_id: string;
  content: string;
  description: string;
  is_completed: boolean;
  labels: string[];
  priority: number;
  due: {
    date: string;
    string: string;
    lang: string;
    is_recurring: boolean;
  } | null;
  url: string;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface TasksResponse {
  tasks: Array<{
    id: number;
    content: string;
    description: string;
    is_completed: boolean;
    labels: string[];
    priority: number;
    due_date: string | null;
    url: string;
    comment_count: number;
  }>;
  total_count: number;
}
