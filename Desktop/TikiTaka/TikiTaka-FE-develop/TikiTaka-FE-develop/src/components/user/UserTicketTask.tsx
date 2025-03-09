import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

export default function UserTicketTask({progress = 0}: {progress?: number}) {
  const completed = Math.round(progress) || 0;
  const remaining = 100 - completed;

  const data = [{completed: completed, remaining: remaining}];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-body-bold">Task</label>
        <label className="text-body-bold">
          Progress: <span className="text-main2-3">{Math.round(progress)}%</span>
        </label>
      </div>

      <div className="h-[50px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={20} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
              }}
              cursor={{fill: 'transparent'}}
              formatter={(value, name) => [`${value}%`, name === 'completed' ? 'Progress' : 'Remaining']}
            />
            <Bar dataKey="completed" stackId="a" fill="#F0C000" radius={completed === 100 ? 10 : [10, 0, 0, 10]} />
            <Bar dataKey="remaining" stackId="a" fill="#e0e0e0" radius={remaining === 100 ? 10 : [0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
