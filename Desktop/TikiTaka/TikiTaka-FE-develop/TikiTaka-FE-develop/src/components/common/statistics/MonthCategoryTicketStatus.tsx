import {useState} from 'react';
import {Bar, BarChart, XAxis, PieChart, Pie, Cell, Tooltip} from 'recharts';
import {useQuery} from '@tanstack/react-query';
import {getMonthlyCategorySummary} from '../../../api/service/statistics';
import {commonTooltipStyle} from '../../../constants/constants';
import {ERROR_MESSAGES} from '../../../constants/error';
import LoadingStatus from '../LoadingStatus';
const COLORS = ['#F6D47A', '#FFB74D', '#FFD700']; // 색상 팔레트

interface CategoryData {
  firstCategoryName: string;
  secondCategoryName: string | null;
  totalCreated: number;
}

export default function MonthCategoryTicketStatus() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentDate = new Date();
  const [year, _setYear] = useState(currentDate.getFullYear());
  const [month, _setMonth] = useState(currentDate.getMonth() + 1);

  const {
    data: categoryData,
    isLoading,
    isError,
  } = useQuery<MonthlyCategorySummary, Error>({
    queryKey: ['monthlyCategorySummary', year, month],
    queryFn: () => getMonthlyCategorySummary(year, month),
  });

  if (isLoading) return <LoadingStatus/>
  if (isError) return <div>에러가 발생했습니다.</div>;

  const processData = (data: CategoryData[]) => {
    const primaryData = data
      .filter((item) => item.secondCategoryName === null)
      .map((item) => ({
        name: item.firstCategoryName,
        ticket: item.totalCreated,
      }));

    const secondaryData = data.reduce(
      (acc, item) => {
        if (item.secondCategoryName) {
          if (!acc[item.firstCategoryName]) {
            acc[item.firstCategoryName] = [];
          }
          acc[item.firstCategoryName].push({
            name: item.secondCategoryName,
            value: item.totalCreated,
          });
        }
        return acc;
      },
      {} as Record<string, {name: string; value: number}[]>
    );

    return {primaryData, secondaryData};
  };

  const {primaryData, secondaryData} = processData(categoryData?.data ?? []);
  return (
    <div className="flex flex-col w-full h-[500px] bg-gray-18 p-5">
      <div className="flex items-center gap-4">
        <h1 className="text-title-bold">카테고리별 티켓 생성 현황</h1>
        <div className="bg-gray-1 border border-gray-2 rounded-full py-1 px-4 text-body-bold w-fit">
          1차 카테고리 Bar 클릭 시 2차 카테고리 데이터를 확인 가능합니다.
        </div>
      </div>
      <div className="flex flex-col bg-white rounded border border-gray-2 p-10 mt-4">
        <div className="flex items-start gap-10 w-full bg-gray-18 p-5">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-center text-subtitle bg-main text-white rounded-full px-3 py-2 w-fit">
              1차 카테고리
            </div>
            <section className="ml-10">
              {primaryData && primaryData.length > 0 ? (
                <BarChart width={240} height={340} data={primaryData} margin={{left: 10, right: 10, top: 10, bottom: 0}}>
                  <XAxis
                    dataKey="name"
                    tick={{fontSize: 8, fontWeight: 700}}
                    axisLine={false}
                    tickLine={false}
                    angle={-45}
                    width={400}
                    height={120}
                    padding={{left: 25}}
                    textAnchor="end"
                    tickFormatter={(tick: string) => tick}
                  />
                  <Tooltip cursor={false} contentStyle={commonTooltipStyle} formatter={(value, name) => [`${value}건`, name]} />
                  <Bar
                    dataKey="ticket"
                    fill="#F6D47A"
                    radius={100}
                    onMouseEnter={(_, index) => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={(data) => setSelectedCategory(data.name)}
                  >
                    {primaryData?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={hoverIndex === index || selectedCategory === primaryData[index].name ? '#D4A946' : '#F6D47A'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <div className="text-gray-500 text-center py-4">{ERROR_MESSAGES.NO_PRIMARY_CATEGORY}</div>
              )}
            </section>
          </div>

          {selectedCategory && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-center text-subtitle bg-main text-white rounded-full px-3 py-2 w-fit">
                2차 카테고리
              </div>
              {secondaryData[selectedCategory] && secondaryData[selectedCategory].length > 0 ? (
                <section className="ml-10 grid grid-cols-2 text-subtitle">
                  <div className="flex flex-col items-center gap-4">
                    <PieChart width={200} height={200}>
                      <Pie
                        key={selectedCategory}
                        data={secondaryData[selectedCategory]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={30}
                        dataKey="value"
                      >
                        {secondaryData[selectedCategory]?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={commonTooltipStyle} formatter={(value, name) => [`${value}건`, name]} />
                    </PieChart>
                    <div className="text-main2-3 text-center">{selectedCategory} 세부 분류</div>
                  </div>

                  <div className="flex flex-col justify-center gap-3 ml-10">
                    {secondaryData[selectedCategory]?.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                        <span>{item.name}</span>
                        <span className="ml-auto">{item.value}건</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="text-gray-500 text-center py-4">{ERROR_MESSAGES.NO_SECONDARY_CATEGORY}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
