import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { formatINR, formatDateIST } from '../lib/format';
import {
  CheckCircle2,
  ArrowRight,
  Receipt,
  ShieldCheck,
} from 'lucide-react';

export const OrderResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  const order = state.simulatedOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-textPrimary">Order Record Not Found</h2>
        <p className="text-sm text-textSecondary">
          This order might have been cleared from local storage or belongs to an earlier prototype session.
        </p>
        <Button onClick={() => navigate('/orders')}>View Order History</Button>
      </div>
    );
  }

  const isBuy = order.side === 'BUY';
  const grossValue = order.price * order.quantity;
  const netAmount = isBuy
    ? grossValue + order.charges.totalApplicable
    : Math.max(0, grossValue - order.charges.totalApplicable);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Confirmation Card */}
      <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-0.5 rounded-full uppercase">
              Simulated Execution
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">
            Simulated Order Recorded
          </h1>
          <p className="text-xs text-textSecondary">
            Your demo order has been logged into your browser&apos;s local transaction record.
          </p>
        </div>

        {/* Order Details Receipt */}
        <div className="bg-bgSurface border border-border rounded-xl p-4 text-left space-y-3">
          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Order ID:</span>
            <span className="text-xs font-mono font-semibold text-textPrimary">
              {order.id}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Timestamp (IST):</span>
            <span className="text-xs font-semibold text-textPrimary">
              {formatDateIST(order.timestamp)}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Security:</span>
            <span className="text-xs font-bold text-textPrimary">
              {order.instrumentName}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Action & Product:</span>
            <span className="text-xs font-bold text-textPrimary">
              Simulated {order.side} ({order.product})
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Executed Quantity:</span>
            <span className="text-xs font-semibold text-textPrimary tabular-nums">
              {order.quantity.toLocaleString('en-IN')} units @ {formatINR(order.price)}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Gross Trade Value:</span>
            <span className="text-xs font-bold text-textPrimary tabular-nums">
              {formatINR(grossValue)}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border pb-2.5">
            <span className="text-xs text-textMuted">Statutory & Demo Fees:</span>
            <span className="text-xs font-semibold text-textPrimary tabular-nums">
              {formatINR(order.charges.totalApplicable)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 text-sm">
            <span className="font-bold text-textPrimary">
              {isBuy ? 'Simulated Net Paid:' : 'Simulated Net Received:'}
            </span>
            <span className="font-extrabold text-primary-600 tabular-nums text-base">
              {formatINR(netAmount)}
            </span>
          </div>
        </div>

        {/* Safety Note */}
        <div className="p-3 bg-primary-50/50 border border-primary-200/60 rounded-xl text-left text-xs text-primary-900 flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-primary-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            This transaction was recorded entirely inside your local browser memory for prototype evaluation. No banking or Demat operations were triggered.
          </p>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate('/orders')}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2"
          >
            <Receipt size={16} />
            View Orders List
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2"
          >
            Explore More Markets
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
