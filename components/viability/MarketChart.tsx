'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface MarketChartDataPoint {
  name: string
  value: number
  fill?: string
}

interface MarketChartProps {
  data: MarketChartDataPoint[]
}

export function MarketChart({ data }: MarketChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          <Bar
            dataKey="value"
            fill="#FF0000"
            radius={[4, 4, 0, 0]}
            name="Competition density"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
