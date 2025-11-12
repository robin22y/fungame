import React, { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCardThemeClasses, getTextThemeClasses, getAccentThemeClasses } from '../utils/themeManager';

interface Transaction {
  id: string;
  memberId: string;
  amount: number;
  xpConverted: number;
  timestamp: string;
}

export function WalletPage() {
  const { family, currentMember, appTheme } = useApp();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('wallet_transactions');
    return stored ? JSON.parse(stored) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  if (!family || !currentMember) return null;

  const xpToCoinRate = 10;
  const availableCoins = Math.floor(currentMember.totalXp / xpToCoinRate);
  const remainingXp = currentMember.totalXp % xpToCoinRate;

  const handleCashOut = () => {
    if (availableCoins > 0) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        memberId: currentMember.id,
        amount: availableCoins,
        xpConverted: availableCoins * xpToCoinRate,
        timestamp: new Date().toISOString(),
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('wallet_transactions', JSON.stringify(updatedTransactions));
    }
  };

  const memberTransactions = transactions.filter(t => t.memberId === currentMember.id);

  const cardClasses = getCardThemeClasses(appTheme);
  const textClasses = getTextThemeClasses(appTheme);
  const accentClasses = getAccentThemeClasses(appTheme);

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`${cardClasses} rounded-3xl shadow-xl p-8 mb-6 border-2`}>
        <div className="text-center mb-6">
          <Wallet className={`w-16 h-16 ${accentClasses} mx-auto mb-3`} />
          <h2 className={`text-3xl font-bold ${textClasses} mb-2`}>Pocket Money Wallet</h2>
          <p className={`${textClasses} opacity-80`}>Convert your XP into coins</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6 border-2 border-green-300 text-center">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <p className="text-gray-600 text-lg mb-2">Available Coins</p>
          <p className="text-6xl font-bold text-green-600 mb-4">{availableCoins}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <p>
              {remainingXp} XP remaining ({xpToCoinRate - remainingXp} more for next coin)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 text-center border-2 border-blue-300">
            <p className="text-sm text-blue-800 font-semibold mb-2">Total XP</p>
            <p className="text-3xl font-bold text-blue-900">{currentMember.totalXp}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 text-center border-2 border-purple-300">
            <p className="text-sm text-purple-800 font-semibold mb-2">Cash Balance</p>
            <p className="text-3xl font-bold text-purple-900">
              {family.currency}{currentMember.totalCash.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-amber-100 rounded-2xl p-4 mb-6 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-amber-700" />
            <p className="text-sm font-bold text-amber-900">Conversion Rate</p>
          </div>
          <p className="text-amber-800">
            Every <span className="font-bold">{xpToCoinRate} XP</span> = <span className="font-bold">1 Coin</span>
          </p>
        </div>

        <button
          onClick={handleCashOut}
          disabled={availableCoins === 0}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Cash Out {availableCoins} Coins
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-300 flex items-center justify-center gap-2"
        >
          <History className="w-5 h-5" />
          {showHistory ? 'Hide' : 'Show'} Transaction History
        </button>
      </div>

      {showHistory && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <History className="w-6 h-6" />
            Transaction History
          </h3>

          {memberTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📜</div>
              <p className="text-gray-600">No transactions yet</p>
              <p className="text-gray-500 text-sm mt-2">Cash out your coins to see history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {memberTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between bg-green-50 rounded-xl p-4 border border-green-200"
                >
                  <div>
                    <p className="font-bold text-gray-800">
                      Cashed Out {transaction.amount} Coins
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +{transaction.amount} 💰
                    </p>
                    <p className="text-xs text-gray-600">
                      ({transaction.xpConverted} XP)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
