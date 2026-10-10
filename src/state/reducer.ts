import type { AppState, AppAction } from './types';

export const INITIAL_STATE: AppState = {
  watchlist: ['stock-bpcl', 'stock-ifbl', 'mf-001', 'bond-gsec-001'],
  notificationReadState: {
    n4: true,
    n5: true,
  },
  simulatedOrders: [],
  optionsGateAcknowledged: false,
  selectedCategory: 'MF',
  reportedPosts: [],
  preferences: {
    showBeginnersOnly: false,
    notifyEvents: true,
    notifyWatchlist: true,
    notifyResults: true,
  },
  activeOrderDraft: null,
  searchQuery: '',
};

const STORAGE_KEY = 'genz_groww_prototype_state_v1';

export function loadPersistedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      preferences: {
        ...INITIAL_STATE.preferences,
        ...(parsed.preferences || {}),
      },
    };
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
    return INITIAL_STATE;
  }
}

export function persistState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to persist state to localStorage:', err);
  }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'TOGGLE_WATCHLIST': {
      const exists = state.watchlist.includes(action.payload);
      newState = {
        ...state,
        watchlist: exists
          ? state.watchlist.filter((id) => id !== action.payload)
          : [...state.watchlist, action.payload],
      };
      break;
    }

    case 'MARK_NOTIFICATION_READ': {
      newState = {
        ...state,
        notificationReadState: {
          ...state.notificationReadState,
          [action.payload]: true,
        },
      };
      break;
    }

    case 'MARK_ALL_NOTIFICATIONS_READ': {
      // Set all known notifications to true
      newState = {
        ...state,
        notificationReadState: {
          ...state.notificationReadState,
          n1: true,
          n2: true,
          n3: true,
          n4: true,
          n5: true,
          n6: true,
          n7: true,
          n8: true,
          n9: true,
          n10: true,
        },
      };
      break;
    }

    case 'ADD_SIMULATED_ORDER': {
      newState = {
        ...state,
        simulatedOrders: [action.payload, ...state.simulatedOrders],
        activeOrderDraft: null,
      };
      break;
    }

    case 'ACKNOWLEDGE_OPTIONS_GATE': {
      newState = {
        ...state,
        optionsGateAcknowledged: true,
      };
      break;
    }

    case 'SET_SELECTED_CATEGORY': {
      newState = {
        ...state,
        selectedCategory: action.payload,
      };
      break;
    }

    case 'REPORT_POST': {
      if (state.reportedPosts.includes(action.payload)) {
        return state;
      }
      newState = {
        ...state,
        reportedPosts: [...state.reportedPosts, action.payload],
      };
      break;
    }

    case 'UPDATE_PREFERENCES': {
      newState = {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
      break;
    }

    case 'SET_ORDER_DRAFT': {
      newState = {
        ...state,
        activeOrderDraft: action.payload,
      };
      break;
    }

    case 'SET_SEARCH_QUERY': {
      newState = {
        ...state,
        searchQuery: action.payload,
      };
      break;
    }

    case 'RESET_DEMO': {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('Error clearing localStorage:', err);
      }
      return INITIAL_STATE;
    }

    default:
      return state;
  }

  persistState(newState);
  return newState;
}
