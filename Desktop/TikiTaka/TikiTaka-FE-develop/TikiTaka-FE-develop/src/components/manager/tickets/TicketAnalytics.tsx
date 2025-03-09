import {Bar, BarChart, LabelList, XAxis} from 'recharts';
import {useUserStore} from '../../../store/store';
import {useQuery} from '@tanstack/react-query';
import {getWeeklyTicketSummary} from '../../../api/service/statistics';

export default function TicketAnalytics() {
  const {userId} = useUserStore();

  const {data: weeklyData} = useQuery({
    queryKey: ['weeklyTicketSummary', userId],
    queryFn: () => getWeeklyTicketSummary(userId),
    enabled: !!userId,
  });

  const chartData = weeklyData
    ? [
        {name: 'Mon', ticket: weeklyData.weeklyTicketCounts.Mon},
        {name: 'Tue', ticket: weeklyData.weeklyTicketCounts.Tue},
        {name: 'Wed', ticket: weeklyData.weeklyTicketCounts.Wed},
        {name: 'Thu', ticket: weeklyData.weeklyTicketCounts.Thu},
        {name: 'Fri', ticket: weeklyData.weeklyTicketCounts.Fri},
        {name: 'Sat', ticket: weeklyData.weeklyTicketCounts.Sat},
        {name: 'Sun', ticket: weeklyData.weeklyTicketCounts.Sun},
      ]
    : [];

  return (
    <>
      {weeklyData && (
        <div className="flex items-center gap-6 w-full bg-gray-18 p-5">
          <section>
            <p className="pl-2 text-caption-regular text-gray-14">단위: 건</p>
            <BarChart width={240} height={120} data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Bar dataKey="ticket" fill="#F6D47A" radius={100}>
                <LabelList dataKey="ticket" position="center" fill="#FFFFFF" height={40} fontSize={10} />
              </Bar>
            </BarChart>
          </section>

          <section className="grid grid-cols-2 text-subtitle">
            <div className="space-y-4">
              <div>금일 티켓 처리 건수</div>
              <div>금일 긴급 티켓 건수</div>
              <div>금주 티켓 처리 건수</div>
            </div>

            <div className="text-right text-main2-3 space-y-4">
              <div>{weeklyData?.dayTickets}건</div>
              <div>{weeklyData && weeklyData?.dayUrgentTickets}건</div>
              <div>{weeklyData && weeklyData?.weekTickets}건</div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
