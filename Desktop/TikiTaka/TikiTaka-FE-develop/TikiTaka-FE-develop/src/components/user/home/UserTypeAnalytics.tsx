import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {getDailyTicketTypeSummary} from '../../../api/service/statistics';

const COLORS = ['#F0C000', '#FFDF5F', '#FFD700', '#FFA500'];

const translateTicketType = (type: string) => {
  switch (type) {
    case 'CREATE':
      return '생성';
    case 'UPDATE':
      return '수정';
    case 'DELETE':
      return '삭제';
    case 'ETC':
      return '기타';
    default:
      return type;
  }
};

export default function UserTypeAnalytics() {
  const {data: ticketData} = useQuery({
    queryKey: ['dailyTicketTypeSummary'],
    queryFn: getDailyTicketTypeSummary,
  });

  const sortedData = useMemo(() => {
    if (!ticketData) return [];
    return ticketData
      .map((item) => ({
        name: translateTicketType(item.ticketTypeName),
        ticket: item.ticketCount,
        originalName: item.ticketTypeName,
      }))
      .sort((a, b) => {
        if (a.originalName === 'ETC') return 1;
        if (b.originalName === 'ETC') return -1;
        return b.ticket - a.ticket;
      });
  }, [ticketData]);

  return (
    <div className="flex flex-col w-full h-[430px] bg-gray-18 p-5">
      <h1 className="text-title-bold">금일 티켓 처리 유형 </h1>
      <div className="flex items-center gap-10 h-full bg-white rounded border border-gray-2 p-10 mt-4">
        <section className="w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sortedData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="ticket">
                {sortedData.map((entry, index) => (
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

        <section className="grid grid-cols-2 gap-4 text-subtitle">
          <div className="space-y-4">
            {sortedData.map((item) => (
              <div key={item.name} className="truncate whitespace-nowrap">
                {item.name}
              </div>
            ))}
          </div>

          <div className="text-right text-main2-3 space-y-4">
            {sortedData.map((item) => (
              <div key={item.name}>{item.ticket}건</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
