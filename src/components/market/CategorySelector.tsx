import React from 'react';
import type { AssetClass } from '../../types';
import { useApp } from '../../state/AppContext';
import { Layers, TrendingUp, Landmark, ShieldCheck, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: AssetClass;
  label: string;
  icon: React.ReactNode;
}

export const CategorySelector: React.FC = () => {
  const { state, dispatch } = useApp();

  const categories: CategoryItem[] = [
    { id: 'MF', label: 'Mutual Funds', icon: <Layers size={15} /> },
    { id: 'STOCK', label: 'Stocks', icon: <TrendingUp size={15} /> },
    { id: 'ETF', label: 'ETFs', icon: <Sparkles size={15} /> },
    { id: 'BOND', label: 'Bonds', icon: <ShieldCheck size={15} /> },
    { id: 'IPO', label: 'IPOs', icon: <Landmark size={15} /> },
  ];

  return (
    <div
      role="region"
      aria-label="Asset Category Selector"
      className="py-1"
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isSelected = state.selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: cat.id })}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 min-h-[44px] select-none border cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500 ${
                isSelected
                  ? 'bg-primary-500 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-textSecondary hover:text-textPrimary hover:bg-bgSurface border-border'
              }`}
            >
              <span aria-hidden="true" className={isSelected ? 'text-white' : 'text-primary-600'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
