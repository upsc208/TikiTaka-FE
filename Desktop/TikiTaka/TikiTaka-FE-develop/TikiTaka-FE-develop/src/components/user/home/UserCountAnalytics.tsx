import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {getTicketStatusCount} from '../../../api/service/tickets';
import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import { useUserStore } from '../../../store/store';

const COLORS = ['#F0C000', '#FFDF5F', '#FFD700', '#FFA500', '#F4C2C1'];

export default function UserCountAnalytics() {
  const userId = useUserStore((state) => state.userId);

  const { data: ticketCounts } = useQuery({
        queryKey: ["ticketStatusCounts", userId],
        queryFn: ({ queryKey }) => {
          const requesterId = Number(queryKey[1]) || undefined; // queryKey에서 userId 추출
          return getTicketStatusCount(requesterId);
        },
        staleTime: 1000 * 60, 
      });

  const chartData = useMemo(() => {
    if (!ticketCounts) return [];
    return [
      {name: '대기중', ticket: ticketCounts.pending || 0},
      {name: '진행중', ticket: ticketCounts.inProgress || 0},
      {name: '검토중', ticket: ticketCounts.reviewing || 0},
      {name: '완료', ticket: ticketCounts.completed || 0},
      {name: '긴급', ticket: ticketCounts.urgent || 0},
    ];
  }, [ticketCounts]);

  return (
    <div className="flex flex-col w-full bg-gray-18 p-5">
      <h1 className="text-subtitle">나의 요청 티켓 현황</h1>
      <div className="flex items-center gap-20 ">
        <section className="w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="ticket">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                formatter={(value, name) => [`${value}건`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="grid grid-cols-2 gap-3 text-subtitle">
          <div className="space-y-4">
            <div>전체</div>
            {chartData.map((item) => (
              <div key={item.name}>{item.name}</div>
            ))}
          </div>

          <div className="text-right text-main2-3 space-y-4">
            <div>{ticketCounts?.total || 0}건</div>
            {chartData.map((item) => (
              <div key={item.name}>{item.ticket}건</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
