declare interface CreateTicketFormData {
  mustDescription: string;
  description: string;
}

declare interface UpdateTicketFormData {
  mustDescription: string;
  description: string;
}

declare interface CreateTicketTypeData {
  typeName: string;
}

declare interface UpdateTicketTypeData {
  typeName: string;
}

declare interface CreateTicketData {
  title: string;
  description: string;
  urgent: boolean;
  typeId: number;
  deadline: string;
  primaryCategoryId?: number;
  secondaryCategoryId?: number;
  managerId?: number;
  files?: File[];
}

declare interface TicketStatusCount {
  total: number;
  pending: number;
  inProgress: number;
  reviewing: number;
  completed: number;
  urgent: number;
  requesterId?: number;
}

declare interface Attachment {
  attachmentId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
}

declare interface TicketDetails {
  ticketId: number;
  title: string;
  description: string;
  priority: string | null;
  status: keyof typeof STATUS_MAP;
  typeId: number;
  typeName: string;
  firstCategoryId: number;
  firstCategoryName: string;
  secondCategoryId: number;
  secondCategoryName: string;
  managerId: number;
  managerName: string;
  requesterId: number;
  requesterName: string;
  urgent: boolean;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  progress: number;
}

declare interface PendingApprovalCount {
  myPendingTicket: number;
  allPendingTicket: number;
  urgentPendingTicket: number;
}

declare interface PendingTicketCount {
  myPendingTicket: number;
  unassignedPendingTicket: number;
}

declare interface PersonalTicketStatus {
  pendingTicket: number;
  processingTicket: number;
  doneTicket: number;
}

declare interface TicketListItem {
  priority: string;
  ticketId: number;
  title: string;
  description: string;
  typeName: string;
  firstCategoryName: string;
  secondCategoryName: string;
  managerName: string;
  status: string;
  urgent: boolean;
  deadline: string;
  createdAt: string;
}

declare interface TicketListResponse {
  content: TicketListItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

declare interface TicketListParams {
  page?: number;
  size?: number;
  status?: string;
  firstCategoryId?: number;
  secondCategoryId?: number;
  ticketTypeId?: number;
  managerId?: number;
  requesterId?: number;
  orderBy?: string;
  createdAt?: string;
  urgent?: boolean;
  sort?: string;
}

declare interface UpdateTicketParams {
  title: string;
  description: string;
  urgent: boolean;
  ticketTypeId?: number;
  firstCategoryId?: number;
  secondCategoryId?: number;
  deadline: string;
}

declare interface UpdateTicketCategoryParams {
  firstCategoryId: number;
  secondCategoryId?: number | null;
}

declare interface UpdateTicketTypeParams {
  ticketTypeId: number;
}

declare interface UpdateTicketUrgentRequest {
  urgent: boolean;
}

declare interface UpdateTicketUrgentResponse {
  message: string;
  data: null;
}

declare interface TicketType {
  typeId: number;
  typeName: string;
}
