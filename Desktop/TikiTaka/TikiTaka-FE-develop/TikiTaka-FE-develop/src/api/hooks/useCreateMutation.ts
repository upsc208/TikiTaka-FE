import {useMutation, useQueryClient} from '@tanstack/react-query';

export const QUERY_KEY = {
  TICKET_DETAILS: 'ticketDetails',
  TICKET: 'ticket',
  MANAGERS: 'managers',
  TYPES: 'types',
  CATEGORIES: 'categories',
};

export const useCreateMutation = <T>(
  mutationFn: (arg: T) => Promise<any>,
  errorMessage: string,
  ticketId: number,
  invalidateQueryKeys?: string[][] // 무효화할 쿼리 키 배열을 선택적으로 전달
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.TICKET_DETAILS, ticketId]});

      if (invalidateQueryKeys) {
        invalidateQueryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({queryKey});
        });
      }
    },
    onError: () => {
      alert(errorMessage);
    },
  });
};
