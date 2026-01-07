import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import React from 'react';

interface RolePieChartProps {
  distribution: Record<string, number>;
}

interface RegistrationGraphProps {
  createdAt: number[];
  maxMonthlySignups: number;
  lineColor: string; // The color passed from parent
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
          animationDuration={300}
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
export function RegistrationGraph({ createdAt, maxMonthlySignups, lineColor }: RegistrationGraphProps) {
  const chartData = React.useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    
    // Create the last 12 months as keys with 0 values
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      months[monthKey] = 0;
    }

    // Fill with actual data
    createdAt.forEach(ts => {
      const date = new Date(ts);
      const month = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (months[month] !== undefined) {
        months[month]++;
      }
    });

    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [createdAt]);

  return (
    <ResponsiveContainer width="100%" height="90%">
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid 
            strokeDasharray="5 5"
            stroke="rgba(255,255,255,0.2)"
            vertical={false} 
          />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            domain={[0, maxMonthlySignups]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#334155',
              border: 'none', 
              borderRadius: '8px' 
            }}
            itemStyle={{ color: lineColor }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            name="Sign Ups"
            stroke={lineColor}
            strokeWidth={3} 
            dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }}
            animationDuration={300}
          />
        </LineChart>
    </ResponsiveContainer>
  );
}