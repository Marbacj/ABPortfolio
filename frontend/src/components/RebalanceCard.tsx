'use client'

import { AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn, formatPercent } from '@/lib/utils'
import type { RebalanceAdvice } from '@/types'

interface RebalanceCardProps {
  data: RebalanceAdvice | null
  loading: boolean
}

export function RebalanceCard({ data, loading }: RebalanceCardProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return <ArrowUp className="w-4 h-4 text-green-400" />
      case 'sell':
        return <ArrowDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'buy':
        return '买入'
      case 'sell':
        return '卖出'
      default:
        return '持有'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'text-green-400 bg-green-500/10'
      case 'sell':
        return 'text-red-400 bg-red-500/10'
      default:
        return 'text-slate-400 bg-slate-500/10'
    }
  }

  return (
    <div className="glass rounded-2xl p-6 card-hover h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">再平衡建议</h3>
        {data && (
          <span className="text-xs text-slate-500">
            阈值: {(data.threshold * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-slate-800/50 rounded-lg animate-pulse" />
        </div>
      ) : !data ? (
        <div className="h-32 flex items-center justify-center text-slate-500">
          暂无数据
        </div>
      ) : (
        <>
          {/* 状态提示 */}
          <div
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl mb-4',
              data.needs_rebalance
                ? 'bg-amber-500/10 border border-amber-500/30'
                : 'bg-green-500/10 border border-green-500/30'
            )}
          >
            {data.needs_rebalance ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            )}
            <p
              className={cn(
                'text-sm',
                data.needs_rebalance ? 'text-amber-200' : 'text-green-200'
              )}
            >
              {data.summary}
            </p>
          </div>

          {/* 操作列表 */}
          <div className="space-y-2">
            {data.actions.map((action) => (
              <div
                key={action.symbol}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getActionIcon(action.action)}
                  <span className="font-mono font-medium text-slate-200">
                    {action.symbol}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* 权重对比 */}
                  <div className="text-right text-xs">
                    <span className="text-slate-500">当前</span>
                    <span className="ml-1 font-mono text-slate-300">
                      {(action.current_weight * 100).toFixed(1)}%
                    </span>
                    <span className="mx-1 text-slate-600">→</span>
                    <span className="text-slate-500">目标</span>
                    <span className="ml-1 font-mono text-slate-300">
                      {(action.target_weight * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* 操作标签 */}
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      getActionColor(action.action)
                    )}
                  >
                    {getActionText(action.action)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
