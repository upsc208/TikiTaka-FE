import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateTicketPriority} from '../service/tickets';

interface UseUpdateTicketPriorityOptions {
  onSuccess?: (data: any) => void;
  onError?: () => void;
}

export const useUpdateTicketPriority = (ticketId: number, {onSuccess, onError}: UseUpdateTicketPriorityOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPriority: string) => updateTicketPriority(ticketId, newPriority),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['ticket', ticketId]});
      queryClient.invalidateQueries({queryKey: ['ticketDetails', ticketId]});
      queryClient.invalidateQueries({queryKey: ['ticketList', ticketId]});
      if (onSuccess) onSuccess(data);
    },
    onError: () => {
      alert('티켓 우선순위 변경에 실패했습니다. 다시 시도해 주세요.');
      if (onError) onError();
    },
  });
};
