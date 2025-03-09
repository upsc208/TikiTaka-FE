import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import TicketSmall from './TicketSmall';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getTicketList} from '../../../api/service/tickets';
import {useUserStore} from '../../../store/store';
import {TicketStatus} from '../../../constants/constants';
import {useUpdateTicketStatus} from '../../../api/hooks/useUpdateTicketStatus';

export interface TicketDataProps {
  id: number;
  title: string;
  content: string;
  category: string;
  subCategory: string;
  deadline: string;
  assignee: string;
  isUrgent: boolean;
  status: TicketStatus;
  priority: string;
  typeName: string;
}

export default function TicketPersonalManageList() {
  const [tickets, setTickets] = useState<Record<string, TicketDataProps[]>>({
    '대기 중': [],
    '진행 중': [],
    '진행 완료': [],
  });

  const {userId} = useUserStore();

  // 티켓 리스트 조회
  const {data: ticketListData} = useQuery({
    queryKey: ['ticketList'],
    queryFn: () => getTicketList({managerId: userId}),
    enabled: !!userId,
  });

  // 티켓 상태 업데이트
  const updateStatusMutation = useUpdateTicketStatus({
    onSuccess: (ticketId, newStatus) => {
      updateTicketState(ticketId, newStatus);
    },
  });

  // 티켓 상태 업데이트
  const updateTicketState = (ticketId: number, newStatus: TicketStatus) => {
    setTickets((prevTickets) => {
      const updatedTickets = {...prevTickets};
      let movedTicket: TicketDataProps | undefined;

      Object.keys(updatedTickets).forEach((status) => {
        const ticketIndex = updatedTickets[status].findIndex((ticket) => ticket.id === ticketId);
        if (ticketIndex !== -1) {
          [movedTicket] = updatedTickets[status].splice(ticketIndex, 1);
        }
      });

      if (movedTicket) {
        movedTicket.status = newStatus;
        updatedTickets[newStatus].push(movedTicket);
      }

      return updatedTickets;
    });
  };

  useEffect(() => {
    if (ticketListData?.content) {
      const newTickets: Record<string, TicketDataProps[]> = {
        '대기 중': [],
        '진행 중': [],
        '진행 완료': [],
      };

      ticketListData?.content.forEach((ticket) => {
        const newTicket: TicketDataProps = {
          id: ticket.ticketId,
          title: ticket.title,
          typeName: ticket.typeName,
          content: ticket.description,
          category: ticket.firstCategoryName,
          subCategory: ticket.secondCategoryName || '',
          deadline: ticket.deadline,
          assignee: ticket.managerName,
          isUrgent: ticket.urgent,
          priority: ticket.priority,
          status:
            ticket.status === 'PENDING'
              ? '대기 중'
              : ticket.status === 'IN_PROGRESS'
                ? '진행 중'
                : ticket.status === 'DONE'
                  ? '진행 완료'
                  : '대기 중',
        };

        if (ticket.status === 'PENDING') newTickets['대기 중'].push(newTicket);
        else if (ticket.status === 'IN_PROGRESS') newTickets['진행 중'].push(newTicket);
        else if (ticket.status === 'DONE') newTickets['진행 완료'].push(newTicket);
      });

      setTickets(newTickets);
    }
  }, [ticketListData]);

  const handleStatusChange = (ticketId: number, newStatus: TicketStatus) => {
    updateStatusMutation.mutate({ticketId, newStatus});
  };

  // 드래그 앤 드롭 핸들러
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const ticketId = Number(result.draggableId);
    const newStatus = result.destination.droppableId as TicketStatus;

    if (result.source.droppableId !== result.destination.droppableId) {
      updateStatusMutation.mutate({ticketId, newStatus});
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex items-center w-full h-15  bg-gray-1 border border-gray-2 rounded py-4 px-[30px] my-6">
        <h1 className="text-title-bold">나의 티켓 관리</h1>
      </div>

      <div className="w-full bg-gray-18 grid grid-cols-3 gap-x-2 py-5 px-9">
        {Object.entries(tickets).map(([status, items]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <section
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2 py-[26px] px-4 rounded border border-gray-2"
              >
                <header className="flex items-center gap-3">
                  <div
                    className={`w-[8px] h-[8px] rounded-full ${
                      status === '대기 중' ? 'bg-orange' : status === '진행 중' ? 'bg-green' : 'bg-yellow'
                    }`}
                  />
                  <h1 className="text-subtitle">{status}</h1>
                </header>

                {/* 티켓 리스트 */}
                {items.map((ticket, index) => (
                  <Draggable key={ticket.id} draggableId={String(ticket.id)} index={index}>
                    {(provided) => (
                      <TicketSmall
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        id={ticket.id}
                        title={ticket.title}
                        deadline={ticket.deadline}
                        initialPriority={ticket.priority}
                        initialStatus={ticket.status}
                        assignee={ticket.assignee}
                        typeName={ticket.typeName}
                        onStatusChange={handleStatusChange}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
