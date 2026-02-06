'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatDate } from '@/lib/utils'
import type { NavPoint } from '@/types'

interface NavChartProps {
  data: NavPoint[]
  loading: boolean
}

export function NavChart({ data, loading }: NavChartProps) {
  // 处理数据，添加百分比收益
  const chartData = data.map((point, index) => ({
    date: point.date,
    nav: point.nav,
    return: ((point.nav - 1) * 100).toFixed(2),
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="glass rounded-lg px-4 py-3 text-sm">
          <p className="text-slate-400 mb-1">{formatDate(label)}</p>
          <p className="text-slate-200">
            净值: <span className="font-mono font-bold">{item.nav}</span>
          </p>
          <p className={Number(item.return) >= 0 ? 'text-green-400' : 'text-red-400'}>
            收益: <span className="font-mono font-bold">{item.return}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  // 计算Y轴范围
  const navValues = chartData.map((d) => d.nav)
  const minNav = Math.min(...navValues, 1)
  const maxNav = Math.max(...navValues, 1)
  const yDomain = [
    Math.floor(minNav * 100 - 5) / 100,
    Math.ceil(maxNav * 100 + 5) / 100,
  ]

  return (
    <div className="glass rounded-2xl p-6 card-hover h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">净值走势</h3>
        {chartData.length > 0 && (
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-brand-400">
              {chartData[chartData.length - 1]?.nav || '--'}
            </span>
            <p className="text-xs text-slate-500">最新净值</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="space-y-3 w-full">
            <div className="h-4 bg-slate-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-700/50 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-slate-700/50 rounded animate-pulse w-4/6"></div>
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          暂无数据
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(value) => {
                  const d = new Date(value)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                domain={yDomain}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(2)}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="nav"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#navGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
