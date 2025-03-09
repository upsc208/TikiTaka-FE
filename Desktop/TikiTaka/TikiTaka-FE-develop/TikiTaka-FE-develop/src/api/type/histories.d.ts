declare interface ChangeHistoryItem {
  id: number;
  ticketId: number;
  ticketTitle: string;
  updatedByUsername: string;
  updatedAt: string;
  updateType: string;
}

declare interface Pagination {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

declare interface ChangeHistoryResponse {
  content: ChangeHistoryItem[];
  pageable: Pagination;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

declare interface ApiResponse {
  message: string;
  data: ChangeHistoryResponse;
}
