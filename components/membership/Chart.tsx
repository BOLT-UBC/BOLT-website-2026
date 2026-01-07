import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface RolePieChartProps {
  distribution: Record<string, number>;
}

// Role Pie Chart in Statistics Tab
export function RolePieChart({ distribution }: RolePieChartProps) {
  const data = Object.entries(distribution || {}).map(([role, value]) => {
    const name = role.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    return { name, value };
  });

  const COLORS = ['#22d3ee', '#81f8a3', '#fbbf24', '#2dd4bf'];

  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          isAnimationActive={true}
          labelLine={{ stroke: 'rgba(255,255,255,0.5)', strokeWidth: 1 }}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="rgba(255,255,255,0.1)"
              style={{ outline: 'none' }}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Sign-up Timeline in Statistics Tab
export function RegistrationGraph({ createdAt }: { createdAt: number[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData = createdAt.reduce((acc: any[], ts: number) => {
    const date = new Date(ts);
    const month = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    
    const lastEntry = acc[acc.length - 1];
    if (lastEntry && lastEntry.name === month) {
      lastEntry.count++;
    } else {
      acc.push({ name: month, count: 1 });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height="90%">
        {/* Fixed dimensions used instead of ResponsiveContainer */}
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.05)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#334155',
              border: 'none', 
              borderRadius: '8px' 
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            name="Sign Ups"
            stroke="#22d3ee"
            strokeWidth={3} 
            dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={300}
          />
        </LineChart>
    </ResponsiveContainer>
    
  );
}