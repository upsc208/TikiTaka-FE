interface CreateSubtaskParams {
  ticketId: number;
  description: string;
}

interface SubtaskItem {
  subtaskId: number;
  parentId: number;
  description: string;
  done: boolean;
}

interface UpdateSubtaskParams {
  description: string;
  ticketId?: number;
}

interface ProgressResponse {
  progress: number;
}
