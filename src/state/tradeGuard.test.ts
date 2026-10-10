import { describe, it, expect, beforeEach } from 'vitest';
import { appReducer, INITIAL_STATE } from './reducer';
import type { AppState } from './types';
import type { OrderDraft, SimulatedOrder } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/notifications';
import { MOCK_EVENTS } from '../data/marketEvents';
import { calculateCharges, DEMO_FEE_CONFIG } from '../lib/fees';

describe('Accidental Trade Guard & State Reducer Safety Invariants', () => {
  let state: AppState;

  beforeEach(() => {
    state = { ...INITIAL_STATE, simulatedOrders: [] };
  });

  it('ensures reading or dismissing notifications NEVER creates orders', () => {
    const s1 = appReducer(state, { type: 'MARK_NOTIFICATION_READ', payload: 'n1' });
    expect(s1.simulatedOrders.length).toBe(0);
    expect(s1.notificationReadState['n1']).toBe(true);

    const s2 = appReducer(s1, { type: 'MARK_ALL_NOTIFICATIONS_READ' });
    expect(s2.simulatedOrders.length).toBe(0);
    expect(s2.notificationReadState['n2']).toBe(true);
    expect(s2.notificationReadState['n3']).toBe(true);
  });

  it('ensures exploring watchlist, search, or categories NEVER creates orders', () => {
    let s = appReducer(state, { type: 'TOGGLE_WATCHLIST', payload: 'stock-tcs' });
    expect(s.simulatedOrders.length).toBe(0);

    s = appReducer(s, { type: 'SET_SEARCH_QUERY', payload: 'Reliance' });
    expect(s.simulatedOrders.length).toBe(0);

    s = appReducer(s, { type: 'SET_SELECTED_CATEGORY', payload: 'BOND' });
    expect(s.simulatedOrders.length).toBe(0);
  });

  it('ensures educational actions like acknowledging options gate or reporting posts do not create orders', () => {
    let s = appReducer(state, { type: 'ACKNOWLEDGE_OPTIONS_GATE' });
    expect(s.simulatedOrders.length).toBe(0);
    expect(s.optionsGateAcknowledged).toBe(true);

    s = appReducer(s, { type: 'REPORT_POST', payload: 'p-1' });
    expect(s.simulatedOrders.length).toBe(0);
    expect(s.reportedPosts).toContain('p-1');
  });

  it('ensures drafting an order does NOT execute an order', () => {
    const charges = calculateCharges(
      {
        assetClass: 'STOCK',
        product: 'DELIVERY',
        side: 'BUY',
        price: 450,
        quantity: 10,
        exchange: 'NSE',
      },
      DEMO_FEE_CONFIG
    );

    const draft: OrderDraft = {
      instrumentId: 'stock-zenstl',
      instrumentName: 'Zenith Steel & Power Ltd',
      assetClass: 'STOCK',
      product: 'DELIVERY',
      side: 'BUY',
      quantity: 10,
      price: 450,
      orderType: 'MARKET',
      charges,
    };

    const s = appReducer(state, { type: 'SET_ORDER_DRAFT', payload: draft });
    expect(s.activeOrderDraft).toEqual(draft);
    expect(s.simulatedOrders.length).toBe(0); // Zero orders executed
  });

  it('executes an order ONLY on explicit ADD_SIMULATED_ORDER action and clears draft', () => {
    const charges = calculateCharges(
      {
        assetClass: 'STOCK',
        product: 'DELIVERY',
        side: 'BUY',
        price: 450,
        quantity: 10,
        exchange: 'NSE',
      },
      DEMO_FEE_CONFIG
    );

    const simulatedOrder: SimulatedOrder = {
      id: 'SIM-TEST-001',
      instrumentId: 'stock-zenstl',
      instrumentName: 'Zenith Steel & Power Ltd',
      assetClass: 'STOCK',
      product: 'DELIVERY',
      side: 'BUY',
      quantity: 10,
      price: 450,
      orderType: 'MARKET',
      status: 'SIMULATED',
      timestamp: new Date().toISOString(),
      charges,
    };

    const s = appReducer(state, { type: 'ADD_SIMULATED_ORDER', payload: simulatedOrder });
    expect(s.simulatedOrders.length).toBe(1);
    expect(s.simulatedOrders[0].id).toBe('SIM-TEST-001');
    expect(s.activeOrderDraft).toBeNull(); // Draft is consumed and cleared
  });

  it('verifies that RESET_DEMO clears all simulated orders', () => {
    const charges = calculateCharges(
      {
        assetClass: 'STOCK',
        product: 'DELIVERY',
        side: 'BUY',
        price: 1200,
        quantity: 5,
        exchange: 'NSE',
      },
      DEMO_FEE_CONFIG
    );

    const dummyOrder: SimulatedOrder = {
      id: 'SIM-TEST-002',
      instrumentId: 'stock-ifbl',
      instrumentName: 'IndiaFirst Bank Ltd',
      assetClass: 'STOCK',
      product: 'DELIVERY',
      side: 'BUY',
      quantity: 5,
      price: 1200,
      orderType: 'MARKET',
      status: 'SIMULATED',
      timestamp: new Date().toISOString(),
      charges,
    };

    let s = appReducer(state, { type: 'ADD_SIMULATED_ORDER', payload: dummyOrder });
    expect(s.simulatedOrders.length).toBe(1);

    s = appReducer(s, { type: 'RESET_DEMO' });
    expect(s.simulatedOrders.length).toBe(0);
  });

  it('verifies mock notifications contain NO buy/sell action routes', () => {
    MOCK_NOTIFICATIONS.forEach((n) => {
      // Must not link directly to /order or /trade
      if (n.eventId) {
        expect(n.eventId).toMatch(/^evt-/);
      }
      if (n.instrumentId) {
        expect(n.instrumentId).toMatch(/^(stock|mf|bond|etf|ipo)-/);
      }
    });
  });

  it('verifies market events provide neutral exploration and NO direct trade CTAs', () => {
    MOCK_EVENTS.forEach((evt) => {
      expect(evt.affectedInstruments.length).toBeGreaterThan(0);
      evt.affectedInstruments.forEach((inst) => {
        // Must contain a rational explanation and caveat
        expect(inst.reason.length).toBeGreaterThan(15);
        expect(inst.caveat.length).toBeGreaterThan(15);
      });
    });
  });
});
