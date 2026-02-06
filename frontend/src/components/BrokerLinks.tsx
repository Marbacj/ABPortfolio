'use client'

import { ExternalLink, Globe } from 'lucide-react'

const BROKERS = [
  {
    name: '富途证券',
    url: 'https://www.futunn.com/trade',
    region: 'HK/US',
    color: '#ff6b35',
  },
  {
    name: '老虎证券',
    url: 'https://www.tigerbrokers.com/market',
    region: 'US/HK/SG',
    color: '#ff9500',
  },
  {
    name: '盈透证券',
    url: 'https://www.interactivebrokers.com/en/trading/trading-platform.php',
    region: 'Global',
    color: '#d42a2a',
  },
  {
    name: 'Robinhood',
    url: 'https://robinhood.com/stocks',
    region: 'US',
    color: '#00c805',
  },
  {
    name: '雪盈证券',
    url: 'https://www.snowballsecurities.com/trade',
    region: 'US/HK',
    color: '#1e88e5',
  },
]

export function BrokerLinks() {
  return (
    <div className="glass rounded-2xl p-6 card-hover h-full">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">去交易</h3>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        点击下方链接跳转至券商平台进行交易
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BROKERS.map((broker) => (
          <a
            key={broker.name}
            href={broker.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: broker.color }}
              >
                {broker.name.slice(0, 1)}
              </div>
              <div>
                <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                  {broker.name}
                </p>
                <p className="text-xs text-slate-500">{broker.region}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </a>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        本平台不提供交易服务，仅提供跳转链接
      </p>
    </div>
  )
}
