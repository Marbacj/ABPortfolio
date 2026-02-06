'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getAssetColor } from '@/lib/utils'
import type { AssetAllocation } from '@/types'

interface AllocationChartProps {
  data: AssetAllocation[]
  loading: boolean
}

export function AllocationChart({ data, loading }: AllocationChartProps) {
  const chartData = data.map((asset) => ({
    name: asset.category,
    symbol: asset.symbol,
    value: asset.current_weight * 100,
    target: asset.target_weight * 100,
    color: getAssetColor(asset.category),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="glass rounded-lg px-3 py-2 text-sm">
          <p className="font-medium text-slate-200">{item.name}</p>
          <p className="text-slate-400">
            代码: <span className="text-slate-200 font-mono">{item.symbol}</span>
          </p>
          <p className="text-slate-400">
            当前: <span className="text-slate-200">{item.value.toFixed(1)}%</span>
          </p>
          <p className="text-slate-400">
            目标: <span className="text-slate-200">{item.target.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegend = () => (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {chartData.map((item) => (
        <div key={item.symbol} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-slate-400">{item.name}</span>
          <span className="text-slate-200 font-mono">{item.value.toFixed(0)}%</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="glass rounded-2xl p-6 card-hover h-full">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">资产配置</h3>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          暂无数据
        </div>
      ) : (
        <>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {renderLegend()}
        </>
      )}
    </div>
  )
}
