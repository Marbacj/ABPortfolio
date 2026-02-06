'use client'

import { RefreshCw, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onRefresh: () => void
  loading: boolean
}

export function Header({ onRefresh, loading }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/50 glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center glow-effect">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">永久投资组合</h1>
              <p className="text-xs text-slate-500">Permanent Portfolio</p>
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-4">
            {/* 策略说明 */}
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-asset-stock"></span>
              <span>25% 股票</span>
              <span className="w-2 h-2 rounded-full bg-asset-bond ml-2"></span>
              <span>25% 国债</span>
              <span className="w-2 h-2 rounded-full bg-asset-gold ml-2"></span>
              <span>25% 黄金</span>
              <span className="w-2 h-2 rounded-full bg-asset-cash ml-2"></span>
              <span>25% 现金</span>
            </div>

            {/* 刷新按钮 */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-slate-800 hover:bg-slate-700 transition-colors',
                'text-sm font-medium text-slate-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              <span className="hidden sm:inline">刷新数据</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
