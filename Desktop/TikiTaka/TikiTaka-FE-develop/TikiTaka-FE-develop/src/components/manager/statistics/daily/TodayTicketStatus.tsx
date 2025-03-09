import {useQuery} from '@tanstack/react-query';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell} from 'recharts';
import {getDailyTicketSummary} from '../../../../api/service/statistics';
import {commonTooltipStyle} from '../../../../constants/constants';

// 임시 색상
const COLORS = ['#F6D47A', '#FFDF5F', '#F0C000'];

export default function TodayTicketStatus() {
  const {data: ticketData} = useQuery({
    queryKey: ['dailyTicketSummary'],
    queryFn: getDailyTicketSummary,
  });
  // 데이터 변환
  const chartData = ticketData
    ? [
        {name: '생성', ticket: ticketData?.createdTickets},
        {name: '처리 중', ticket: ticketData?.inProgressTickets},
        {name: '완료', ticket: ticketData?.doneTickets},
      ]
    : [];

  // 오늘 날짜 가져오기
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="flex flex-col w-full h-[430px] bg-gray-18 p-5">
      <h1 className="text-title-bold">금일 티켓 처리 현황</h1>
      <div className="flex flex-col h-full bg-white rounded border border-gray-2 p-10 mt-4">
        <div className="flex items-center justify-center text-subtitle bg-main text-white rounded-full px-3 py-2 w-fit">
          {formattedDate}
        </div>
        <div className="flex items-center gap-4 mt-[20px]">
          <section className="w-[400px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis axisLine={false} tickLine={false} type="number" padding={{right: 25}} />
                <YAxis axisLine={false} tick={{fontSize: 12, fontWeight: 700}} tickLine={false} dataKey="name" type="category" width={80} />
                <Tooltip cursor={false} contentStyle={commonTooltipStyle} formatter={(value) => [`${value}건`]} />
                <Bar radius={100} height={20} dataKey="ticket" fill="#8884d8">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>
      </div>
    </div>
  );
}
