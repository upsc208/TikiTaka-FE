import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';

// 임시 데이터 - 당일 티켓 처리 현황
const data = [
  {name: '생성', ticket: 60},
  {name: '처리 중', ticket: 100},
  {name: '완료', ticket: 30},
];

// 임시 색상
const COLORS = ['#F6D47A', '#FFDF5F', '#F0C000'];

export default function TodayTicketStatus() {
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
        <div className="flex items-center gap-8 mt-[20px]">
          <section className="w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="ticket">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}-${entry}`} fill={COLORS[index % COLORS.length]} />
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

          <section className="grid grid-cols-2 gap-8 text-subtitle">
            <div className="space-y-4">
              {data.map((item) => (
                <div key={item.name} className="truncate whitespace-nowrap">
                  {item.name}
                </div>
              ))}
            </div>

            <div className="text-right text-main2-3 space-y-4">
              {data.map((item) => (
                <div key={item.name}>{item.ticket}건</div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
