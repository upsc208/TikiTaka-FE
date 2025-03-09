import {PRIORITY} from '../constants/constants';

export interface UserStore {
  userId: number;
  userName: string;
  setUserId: (id: number) => void;
  setUserName: (userName: string) => void;
  role: 'MANAGER' | 'USER' | 'ADMIN' | 'DEFAULT';
  setRole: (newRole: 'MANAGER' | 'USER' | 'ADMIN' | 'DEFAULT') => void;
}

export interface TokenStore {
  isAuthenticated: boolean;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  login: (accessToken: string) => void;
  logout: () => void;
}

export interface TicketStore {
  priority: PriorityType;
  setPriority: (priority: string) => void;
}

export interface NewTicketStore {
  isUrgent: boolean;
  firstCategory: Category | null;
  secondCategory: Category | null;
  title: string;
  content: string;
  manager: UserListResponse['users'][number] | null;
  ticketType: {typeId: number; typeName: string};
  template: TemplateListItem | null;
  dueDate: string;
  dueTime: string;

  setIsUrgent: (isUrgent: boolean) => void;
  setFirstCategory: (category: Category | null) => void;
  setSecondCategory: (category: Category | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setManager: (manager: UserListResponse['users'][number] | null) => void;
  setTicketType: (ticketType: {typeId: number; typeName: string}) => void;
  setTemplate: (template: TemplateListItem | null) => void;
  setDueDate: (date: string) => void;
  setDueTime: (time: string) => void;

  firstCategoryId: number;
  secondCategoryId: number;
  managerId: number;
  templateId: number;
  setFirstCategoryId: (id: number) => void;
  setSecondCategoryId: (id: number) => void;
  setManagerId: (id: number) => void;
  setTemplateId: (id: number) => void;

  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export interface TemplateStore {
  templateTitle: string;
  firstCategory: Category | null;
  secondCategory: Category | null;
  title: string;
  content: string;
  manager: UserListResponse['users'][number] | null;
  ticketType: {typeId: number; typeName: string};
  setTemplateTitle: (templateTitle: string) => void;
  setFirstCategory: (category: Category | null) => void;
  setSecondCategory: (category: Category | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setManager: (manager: UserListResponse['users'][number] | null) => void;
  setTicketType: (ticketType: {typeId: number; typeName: string}) => void;

  firstCategoryId: number;
  secondCategoryId: number;
  managerId: number;
  setFirstCategoryId: (id: number) => void;
  setSecondCategoryId: (id: number) => void;
  setManagerId: (id: number) => void;
}

export interface NewTicketFormStore {
  mustDescription: string;
  description: string;
  setMustDescription: (mustDescription: string) => void;
  setDescription: (description: string) => void;
}

export type PriorityType = (typeof PRIORITY)[number];

export interface InquiryData {
  inquiryId: number;
  requesterId: number;
  requesterName: string;
  type: 'QUESTION' | 'REQUEST';
  title: string;
  content: string;
  answer: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  commentId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}
