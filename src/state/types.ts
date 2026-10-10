import type {
  AssetClass,
  SimulatedOrder,
  OrderDraft,
} from '../types';


export interface AppPreferences {
  showBeginnersOnly: boolean;
  notifyEvents: boolean;
  notifyWatchlist: boolean;
  notifyResults: boolean;
}

export interface AppState {
  watchlist: string[]; // instrument IDs
  notificationReadState: Record<string, boolean>; // notificationId -> boolean
  simulatedOrders: SimulatedOrder[];
  optionsGateAcknowledged: boolean;
  selectedCategory: AssetClass;
  reportedPosts: string[]; // postId[]
  preferences: AppPreferences;
  activeOrderDraft: OrderDraft | null;
  searchQuery: string;
}

export type AppAction =
  | { type: 'TOGGLE_WATCHLIST'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_SIMULATED_ORDER'; payload: SimulatedOrder }
  | { type: 'ACKNOWLEDGE_OPTIONS_GATE' }
  | { type: 'SET_SELECTED_CATEGORY'; payload: AssetClass }
  | { type: 'REPORT_POST'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppPreferences> }
  | { type: 'SET_ORDER_DRAFT'; payload: OrderDraft | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'RESET_DEMO' };
