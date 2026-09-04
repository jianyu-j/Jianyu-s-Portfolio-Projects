/**
 * Autosave Service for KorIQ
 * Provides debounced automatic saving to localStorage with status tracking
 */

// Types for autosave
export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface AutosaveConfig {
  debounceMs?: number;        // Delay before saving (default: 1000ms)
  storageKey: string;         // localStorage key
  onStatusChange?: (status: AutosaveStatus) => void;
  onError?: (error: Error) => void;
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates an autosave handler for a specific data type
 */
export function createAutosaver<T>(config: AutosaveConfig) {
  const { debounceMs = 1000, storageKey, onStatusChange, onError } = config;
  let currentStatus: AutosaveStatus = 'idle';
  let lastSavedData: string | null = null;

  const setStatus = (status: AutosaveStatus) => {
    currentStatus = status;
    onStatusChange?.(status);
  };

  const saveToStorage = (data: T) => {
    try {
      const serialized = JSON.stringify(data);
      
      // Skip if data hasn't changed
      if (serialized === lastSavedData) {
        setStatus('saved');
        return;
      }

      setStatus('saving');
      localStorage.setItem(storageKey, serialized);
      lastSavedData = serialized;
      
      // Show saved status briefly
      setStatus('saved');
      setTimeout(() => {
        if (currentStatus === 'saved') setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      onError?.(error as Error);
      console.error(`Autosave error for ${storageKey}:`, error);
    }
  };

  const debouncedSave = debounce(saveToStorage, debounceMs);

  return {
    save: (data: T) => {
      setStatus('pending');
      debouncedSave(data);
    },
    saveImmediate: (data: T) => {
      saveToStorage(data);
    },
    load: (): T | null => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          lastSavedData = stored;
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error(`Error loading ${storageKey}:`, error);
      }
      return null;
    },
    getStatus: () => currentStatus,
    clear: () => {
      localStorage.removeItem(storageKey);
      lastSavedData = null;
      setStatus('idle');
    }
  };
}

/**
 * Central autosave registry for all data types
 */
class AutosaveRegistry {
  private savers: Map<string, ReturnType<typeof createAutosaver<any>>> = new Map();
  private globalListeners: ((key: string, status: AutosaveStatus) => void)[] = [];

  register<T>(key: string, config?: Partial<Omit<AutosaveConfig, 'storageKey'>>) {
    if (this.savers.has(key)) {
      return this.savers.get(key)!;
    }

    const saver = createAutosaver<T>({
      storageKey: `korIQ_autosave_${key}`,
      debounceMs: config?.debounceMs ?? 1000,
      onStatusChange: (status) => {
        this.globalListeners.forEach(listener => listener(key, status));
        config?.onStatusChange?.(status);
      },
      onError: config?.onError,
    });

    this.savers.set(key, saver);
    return saver;
  }

  get<T>(key: string) {
    return this.savers.get(key) as ReturnType<typeof createAutosaver<T>> | undefined;
  }

  onStatusChange(listener: (key: string, status: AutosaveStatus) => void) {
    this.globalListeners.push(listener);
    return () => {
      this.globalListeners = this.globalListeners.filter(l => l !== listener);
    };
  }

  getAllStatuses(): Record<string, AutosaveStatus> {
    const statuses: Record<string, AutosaveStatus> = {};
    this.savers.forEach((saver, key) => {
      statuses[key] = saver.getStatus();
    });
    return statuses;
  }

  clearAll() {
    this.savers.forEach(saver => saver.clear());
  }
}

export const autosaveRegistry = new AutosaveRegistry();

// ============================================
// Pre-configured autosavers for common data
// ============================================

// Player profile autosave
export const playerProfileAutosave = autosaveRegistry.register<{
  bio?: string;
  availability?: Record<string, string[]>;
  selfAssessment?: Record<string, number>;
  preferredCourts?: number[];
  style?: string;
}>('playerProfile', { debounceMs: 800 });

// Player settings autosave
export const playerSettingsAutosave = autosaveRegistry.register<{
  notifications?: boolean;
  emailAlerts?: boolean;
  publicProfile?: boolean;
  darkMode?: boolean;
}>('playerSettings', { debounceMs: 500 });

// Match results autosave
export const matchResultsAutosave = autosaveRegistry.register<any[]>('matchResults');

// Messages draft autosave (faster for typing)
export const messageDraftAutosave = autosaveRegistry.register<{
  threadId?: string;
  content: string;
}>('messageDraft', { debounceMs: 300 });

// Coach profile autosave
export const coachProfileAutosave = autosaveRegistry.register<{
  bio?: string;
  specialties?: string[];
  hourlyRate?: number;
  locations?: string[];
}>('coachProfile', { debounceMs: 800 });

// Activity feed preferences
export const activityPrefsAutosave = autosaveRegistry.register<{
  filter?: string;
  hiddenActivities?: number[];
}>('activityPrefs', { debounceMs: 500 });

// Saved courts
export const savedCourtsAutosave = autosaveRegistry.register<number[]>('savedCourts');
