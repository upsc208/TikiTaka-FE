import {useMutation, useQueryClient} from '@tanstack/react-query';
import {STATUS_MAP, TicketStatus} from '../../constants/constants';
import useReverseMap from '../../hooks/useReverseMap';
import {updateTicketStatus} from '../service/tickets';

interface UpdateTicketStatusVariables {
  ticketId: number;
  newStatus: TicketStatus;
}

interface UseUpdateTicketStatusOptions {
  onSuccess?: (ticketId: number, newStatus: TicketStatus) => void;
}

export const useUpdateTicketStatus = ({onSuccess}: UseUpdateTicketStatusOptions = {}) => {
  const queryClient = useQueryClient();
  const REVERSE_STATUS_MAP = useReverseMap(STATUS_MAP);

  return useMutation({
    mutationFn: ({ticketId, newStatus}: UpdateTicketStatusVariables) => {
      const statusKey = REVERSE_STATUS_MAP[newStatus] as keyof typeof STATUS_MAP;
      return updateTicketStatus(ticketId, statusKey);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['ticketList']});
      if (onSuccess) {
        onSuccess(variables.ticketId, variables.newStatus);
      }
    },
    onError: () => {
      alert('티켓 상태 변경에 실패했습니다. 다시 시도해 주세요.');
    },
  });
};
