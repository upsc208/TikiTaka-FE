export const STATUS_MAP = {PENDING: '대기 중', IN_PROGRESS: '진행 중', REVIEW: '검토', DONE: '진행 완료', REJECTED: '반려'};

export const STATUS_OPTIONS = Object.values(STATUS_MAP);

export const TICKET_STATUS = {WAITING: '대기 중', IN_PROGRESS: '진행 중', COMPLETED: '진행 완료'} as const;
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const PRIORITY = ['HIGH', 'MIDDLE', 'LOW'];
export const PRIORITY_COLOR: {[key in (typeof PRIORITY)[number]]: string} = {HIGH: '#F24949', MIDDLE: '#F4B540', LOW: '#93CF1A'};

export const commonTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontSize: '14px',
};

// 로그 유형 변환
export const UPDATE_TYPE_MAP = {
  TICKET_CREATED: '티켓 생성',
  TICKET_EDITED: '수정(사용자)',
  TYPE_CHANGE: '유형 변경',
  STATUS_CHANGE: '상태 변경',
  MANAGER_CHANGE: '담당자 변경',
  PRIORITY_CHANGE: '우선순위 변경',
  CATEGORY_CHANGE: '카테고리 변경',
  DEADLINE_CHANGE: '마감기한 변경',
  TICKET_DELETE: '티켓 삭제',
  URGENT_CHANGE: '긴급 여부 변경',
  OTHER: '기타',
};

export const mapFilterToStatus = (filter: string): string | undefined => {
  switch (filter) {
    case '대기중':
      return 'PENDING';
    case '진행중':
      return 'IN_PROGRESS';
    case '검토 요청':
      return 'REVIEW';
    case '완료':
      return 'DONE';
    default:
      return undefined;
  }
};

export const typeNameMapping: Record<string, string> = {
  CREATE: '생성',
  DELETE: '삭제',
  UPDATE: '수정',
  ETC: '기타',
};

export const statusMapping: Record<string, string> = {
  PENDING: '대기중',
  IN_PROGRESS: '진행중',
  REVIEW: '검토 요청',
  DONE: '완료',
  REJECTED: '반려',
};

export const reverseStatusMapping: Record<string, string> = {
  대기중: 'PENDING',
  진행중: 'IN_PROGRESS',
  완료: 'DONE',
};

export const pageSizeOptions = ['20개씩', '50개씩', '100개씩'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 5;
export const ITEMS_PER_PAGE = 20;

export const ACCOUNT_MENU = ['ID', '이름', '이메일', '역할', '승인 상태'];

export const CATEGORY_MENU = ['1차 카테고리', '2차 카테고리', '요청양식', '카테고리 등록'];
