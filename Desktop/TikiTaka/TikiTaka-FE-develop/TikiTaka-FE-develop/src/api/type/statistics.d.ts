declare interface WeeklyStatsResponse {
  weekCreatedTickets: number;
  weekCompletedTickets: number;
  weekInProgressTickets: number;
  averageCompletionTime: number;
  completionRatio: number;
  lastUpdatedAt: string;
}

declare interface DailyCreationStatsResponse {
  dayCreatedTickets: number;
  dayFirstCategoryTickets: number;
  daySecondCategoryTickets: number;
  averageCompletionTime: number;
  completionRatio: number;
  lastUpdatedAt: string;
}

declare interface DailyHandledStatsResponse {
  dayCompletedTickets: number;
  dayInProgressTickets: number;
  averageCompletionTime: number;
  completionRatio: number;
  lastUpdatedAt: string;
}

declare interface MonthlyHandlingStatsResponse {
  monthCompletedTickets: number;
  monthInProgressTickets: number;
  averageCompletionTime: number;
  completionRatio: number;
  lastUpdatedAt: string;
}

declare interface WeeklyTicketSummaryResponse {
  weeklyTicketCounts: {
    Mon: number;
    Tue: number;
    Wed: number;
    Thu: number;
    Fri: number;
    Sat: number;
    Sun: number;
  };
  dayTickets: number;
  dayUrgentTickets: number;
  weekTickets: number;
}

declare interface DailyTicketSummary {
  createdTickets: number;
  inProgressTickets: number;
  doneTickets: number;
}

declare interface DailyTicketSummaryResponse {
  message: string;
  data: DailyTicketSummary;
}

declare interface ManagerTicketSummary {
  userName: string;
  userId: number;
  userEmail: string;
  userProfile: string;
  doneTickets: number;
  inProgressTickets: number;
}

declare interface DailyManagerTicketSummaryResponse {
  message: string;
  data: ManagerTicketSummary[];
}

declare interface SecondCategory {
  secondCategoryId: number;
  secondCategoryName: string;
  ticketCount: number;
}

declare interface FirstCategory {
  firstCategoryId: number;
  firstCategoryName: string;
  secondCategories: SecondCategory[];
  totalTicketCount: number;
}

declare interface DailyCategorySummary {
  message: string;
  data: FirstCategory[];
}

declare interface MonthlyManagerTicketSummary {
  userName: string;
  userId: number;
  userEmail: string;
  userProfile: string;
  totalManagingCreatedTicket: number;
}

declare interface MonthlyManagerTicketSummaryResponse {
  message: string;
  data: MonthlyManagerTicketSummary[];
}

declare interface SecondCategory {
  secondCategoryId: number;
  secondCategoryName: string;
  ticketCount: number;
}

declare interface FirstCategory {
  firstCategoryId: number;
  firstCategoryName: string;
  secondCategories: SecondCategory[];
  totalTicketCount: number;
}

declare interface MonthlyCategorySummaryResponse {
  message: string;
  data: FirstCategory[];
}

declare interface MonthlyTicketSummary {
  create: number;
  urgent: number;
  complete: number;
}

declare interface MonthlyTicketSummaryResponse {
  message: string;
  data: MonthlyTicketSummary;
}

declare interface MonthlyTicketSummary {
  create: number;
  urgent: number;
  complete: number;
}

declare interface MonthlyTicketSummaryResponse {
  message: string;
  data: MonthlyTicketSummary;
}

declare interface MonthlyCategorySummary {
  message: string;
  data: CategoryData[];
}

declare interface DailyTicketTypeSummary {
  ticketTypeId: number;
  ticketTypeName: string;
  ticketCount: number;
}

declare interface DailyTicketTypeSummaryResponse {
  message: string;
  data: DailyTicketTypeSummary[];
}
