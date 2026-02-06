'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { PerformanceCard } from '@/components/PerformanceCard'
import { AllocationChart } from '@/components/AllocationChart'
import { NavChart } from '@/components/NavChart'
import { QuoteTable } from '@/components/QuoteTable'
import { RebalanceCard } from '@/components/RebalanceCard'
import { BrokerLinks } from '@/components/BrokerLinks'
import { usePortfolioData } from '@/hooks/usePortfolioData'

export default function Home() {
  const { performance, allocation, quotes, rebalance, loading, error, refresh } = usePortfolioData()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">数据加载失败</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Header onRefresh={refresh} loading={loading} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 顶部业绩概览 */}
        <section className="mb-8 animate-fade-in">
          <PerformanceCard data={performance} loading={loading} />
        </section>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 净值走势图 */}
          <section className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <NavChart data={performance?.nav_series || []} loading={loading} />
          </section>

          {/* 资产配置饼图 */}
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <AllocationChart data={allocation?.assets || []} loading={loading} />
          </section>
        </div>

        {/* 实时行情 */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <QuoteTable quotes={quotes} loading={loading} />
        </section>

        {/* 底部区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 再平衡建议 */}
          <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <RebalanceCard data={rebalance} loading={loading} />
          </section>

          {/* 券商链接 */}
          <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <BrokerLinks />
          </section>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>永久投资组合 (Permanent Portfolio) - 经典的低波动稳健投资策略</p>
          <p className="mt-2">数据来源: Yahoo Finance | 仅供参考，不构成投资建议</p>
        </div>
      </footer>
    </main>
  )
}
