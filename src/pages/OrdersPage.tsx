import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatINR, formatDateIST } from '../lib/format';
import { ArrowRight, Clock } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const orders = state.simulatedOrders;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              Simulated Ledger
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
            Order History ({orders.length})
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Log of all demo orders executed in this browser session with itemised charge records.
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyState
          title="No simulated orders recorded yet"
          description="Explore any stock, bond, or mutual fund from the Discover tab, configure your quantity, and complete a simulated transaction."
          action={
            <Button size="sm" onClick={() => navigate('/')}>
              Explore Markets & Trade Demo
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isBuy = order.side === 'BUY';
            const grossValue = order.price * order.quantity;
            const netAmount = isBuy
              ? grossValue + order.charges.totalApplicable
              : Math.max(0, grossValue - order.charges.totalApplicable);

            return (
              <div
                key={order.id}
                className="bg-white border border-border rounded-2xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isBuy ? 'bg-primary-50 text-primary-700' : 'bg-loss/10 text-loss'
                      }`}
                    >
                      {order.side}
                    </span>
                    <span className="text-xs font-bold text-textPrimary">
                      {order.instrumentName}
                    </span>
                    <span className="text-[10px] text-textMuted bg-bgSurface px-2 py-0.5 rounded border border-border uppercase">
                      {order.product}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-textMuted block">Executed Quantity</span>
                    <span className="font-semibold text-textPrimary tabular-nums">
                      {order.quantity.toLocaleString('en-IN')} units
                    </span>
                  </div>

                  <div>
                    <span className="text-textMuted block">Execution Price</span>
                    <span className="font-semibold text-textPrimary tabular-nums">
                      {formatINR(order.price)}
                    </span>
                  </div>

                  <div>
                    <span className="text-textMuted block">Gross Value</span>
                    <span className="font-semibold text-textPrimary tabular-nums">
                      {formatINR(grossValue)}
                    </span>
                  </div>

                  <div>
                    <span className="text-textMuted block">Statutory Charges</span>
                    <span className="font-semibold text-textPrimary tabular-nums">
                      {formatINR(order.charges.totalApplicable)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-textMuted text-[11px]">
                    <Clock size={12} />
                    <span>{formatDateIST(order.timestamp)}</span>
                    <span>·</span>
                    <span className="font-mono">{order.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-textPrimary">
                      {isBuy ? 'Net Paid: ' : 'Net Received: '}
                      <strong className="text-primary-700 tabular-nums">
                        {formatINR(netAmount)}
                      </strong>
                    </span>

                    <Link
                      to={`/order/result/${order.id}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-0.5"
                    >
                      Receipt
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
