'use client'

import { TrendingUp, TrendingDown, Activity, BarChart3, Shield } from 'lucide-react'
import { cn, formatPercent, formatDate } from '@/lib/utils'
import type { PortfolioPerformance } from '@/types'

interface PerformanceCardProps {
  data: PortfolioPerformance | null
  loading: boolean
}

export function PerformanceCard({ data, loading }: PerformanceCardProps) {
  const metrics = [
    {
      label: '总收益率',
      value: data?.total_return,
      icon: TrendingUp,
      highlight: true,
    },
    {
      label: '年化收益 (CAGR)',
      value: data?.cagr,
      icon: BarChart3,
    },
    {
      label: '最大回撤',
      value: data?.max_drawdown,
      icon: TrendingDown,
      negative: true,
    },
    {
      label: '年化波动率',
      value: data?.volatility,
      icon: Activity,
    },
    {
      label: '夏普比率',
      value: data?.sharpe_ratio,
      icon: Shield,
      isRatio: true,
    },
  ]

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-200">组合业绩概览</h2>
        {data && (
          <span className="text-sm text-slate-500">
            {formatDate(data.start_date)} - {formatDate(data.end_date)}
          </span>
        )}
      </div>

      {/* 指标网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const value = metric.value
          const isPositive = value !== undefined && value >= 0
          
          return (
            <div
              key={metric.label}
              className={cn(
                'p-4 rounded-xl transition-colors',
                metric.highlight 
                  ? 'bg-gradient-to-br from-brand-500/20 to-blue-500/20 border border-brand-500/30'
                  : 'bg-slate-800/50'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">{metric.label}</span>
              </div>
              
              {loading ? (
                <div className="h-8 bg-slate-700/50 rounded animate-pulse"></div>
              ) : (
                <div
                  className={cn(
                    'text-2xl font-bold font-numeric',
                    metric.isRatio
                      ? 'text-slate-100'
                      : metric.negative
                        ? 'text-red-400'
                        : isPositive
                          ? 'text-green-400'
                          : 'text-red-400'
                  )}
                >
                  {value !== undefined
                    ? metric.isRatio
                      ? value.toFixed(2)
                      : formatPercent(value)
                    : '--'}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
