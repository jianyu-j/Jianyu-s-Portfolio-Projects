/**
 * React Hooks for Autosave functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AutosaveStatus, 
  createAutosaver, 
  autosaveRegistry,
  playerProfileAutosave,
  playerSettingsAutosave,
  matchResultsAutosave,
  messageDraftAutosave,
  coachProfileAutosave,
  savedCourtsAutosave
} from '../services/autosaveService';

/**
 * Generic hook for autosaving any data
 */
export function useAutosave<T>(
  key: string,
  initialData: T,
  options?: {
    debounceMs?: number;
    enabled?: boolean;
  }
) {
  const [data, setData] = useState<T>(initialData);
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const saverRef = useRef(autosaveRegistry.register<T>(key, {
    debounceMs: options?.debounceMs,
    onStatusChange: setStatus,
  }));

  // Load saved data on mount
  useEffect(() => {
    const savedData = saverRef.current.load();
    if (savedData) {
      setData(savedData);
    }
  }, []);

  // Autosave when data changes
  useEffect(() => {
    if (options?.enabled === false) return;
    saverRef.current.save(data);
  }, [data, options?.enabled]);

  const updateData = useCallback((updater: T | ((prev: T) => T)) => {
    setData(prev => {
      const newData = typeof updater === 'function' 
        ? (updater as (prev: T) => T)(prev) 
        : updater;
      return newData;
    });
  }, []);

  const saveNow = useCallback(() => {
    saverRef.current.saveImmediate(data);
  }, [data]);

  const clear = useCallback(() => {
    saverRef.current.clear();
    setData(initialData);
  }, [initialData]);

  return {
    data,
    setData: updateData,
    status,
    saveNow,
    clear,
  };
}

/**
 * Hook specifically for player profile autosave
 */
export function usePlayerProfileAutosave(initialProfile: {
  bio?: string;
  availability?: Record<string, string[]>;
  selfAssessment?: Record<string, number>;
  preferredCourts?: number[];
  style?: string;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [status, setStatus] = useState<AutosaveStatus>('idle');

  useEffect(() => {
    const saved = playerProfileAutosave.load();
    if (saved) {
      setProfile(prev => ({ ...prev, ...saved }));
    }
  }, []);

  useEffect(() => {
    playerProfileAutosave.save(profile);
  }, [profile]);

  // Subscribe to status changes
  useEffect(() => {
    const unsubscribe = autosaveRegistry.onStatusChange((key, newStatus) => {
      if (key === 'playerProfile') {
        setStatus(newStatus);
      }
    });
    return unsubscribe;
  }, []);

  const updateProfile = useCallback((updates: Partial<typeof profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  return { profile, updateProfile, status };
}

/**
 * Hook for message drafts (with faster debounce)
 */
export function useMessageDraft(threadId?: string) {
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<AutosaveStatus>('idle');

  useEffect(() => {
    const saved = messageDraftAutosave.load();
    if (saved && saved.threadId === threadId) {
      setDraft(saved.content);
    }
  }, [threadId]);

  useEffect(() => {
    if (draft) {
      messageDraftAutosave.save({ threadId, content: draft });
    }
  }, [draft, threadId]);

  useEffect(() => {
    const unsubscribe = autosaveRegistry.onStatusChange((key, newStatus) => {
      if (key === 'messageDraft') {
        setStatus(newStatus);
      }
    });
    return unsubscribe;
  }, []);

  const clearDraft = useCallback(() => {
    setDraft('');
    messageDraftAutosave.clear();
  }, []);

  return { draft, setDraft, status, clearDraft };
}

/**
 * Hook for saved courts
 */
export function useSavedCourts() {
  const [savedCourts, setSavedCourts] = useState<number[]>([]);
  const [status, setStatus] = useState<AutosaveStatus>('idle');

  useEffect(() => {
    const saved = savedCourtsAutosave.load();
    if (saved) {
      setSavedCourts(saved);
    }
  }, []);

  useEffect(() => {
    savedCourtsAutosave.save(savedCourts);
  }, [savedCourts]);

  useEffect(() => {
    const unsubscribe = autosaveRegistry.onStatusChange((key, newStatus) => {
      if (key === 'savedCourts') {
        setStatus(newStatus);
      }
    });
    return unsubscribe;
  }, []);

  const toggleSaved = useCallback((courtId: number) => {
    setSavedCourts(prev => 
      prev.includes(courtId) 
        ? prev.filter(id => id !== courtId)
        : [...prev, courtId]
    );
  }, []);

  const isSaved = useCallback((courtId: number) => {
    return savedCourts.includes(courtId);
  }, [savedCourts]);

  return { savedCourts, toggleSaved, isSaved, status };
}

/**
 * Hook for tracking global autosave status
 */
export function useAutosaveStatus() {
  const [statuses, setStatuses] = useState<Record<string, AutosaveStatus>>({});

  useEffect(() => {
    setStatuses(autosaveRegistry.getAllStatuses());
    
    const unsubscribe = autosaveRegistry.onStatusChange((key, status) => {
      setStatuses(prev => ({ ...prev, [key]: status }));
    });
    
    return unsubscribe;
  }, []);

  const isSaving = Object.values(statuses).some(s => s === 'saving' || s === 'pending');
  const hasError = Object.values(statuses).some(s => s === 'error');
  const allSaved = Object.values(statuses).every(s => s === 'saved' || s === 'idle');

  return { statuses, isSaving, hasError, allSaved };
}
