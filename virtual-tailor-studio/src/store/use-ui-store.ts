import { create } from "zustand";
import type { Notification, UserPreferences } from "@/types";
import { generateId } from "@/lib/utils";

// ============================================================
// UI STORE
// Manages application UI state: panels, notifications, preferences
// ============================================================

interface UIState {
  // Panels
  isCustomizationPanelOpen: boolean;
  isProjectsPanelOpen: boolean;
  isSettingsPanelOpen: boolean;
  isMobileMenuOpen: boolean;
  activeTab: string;

  // Notifications
  notifications: Notification[];

  // Preferences
  preferences: UserPreferences;

  // Loading
  isLoading: boolean;
  loadingMessage: string;

  // Modal
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
}

interface UIActions {
  // Panels
  openCustomizationPanel: () => void;
  closeCustomizationPanel: () => void;
  toggleCustomizationPanel: () => void;
  openProjectsPanel: () => void;
  closeProjectsPanel: () => void;
  openSettingsPanel: () => void;
  closeSettingsPanel: () => void;
  toggleMobileMenu: () => void;
  setActiveTab: (tab: string) => void;

  // Notifications
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Preferences
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;

  // Loading
  setLoading: (loading: boolean, message?: string) => void;

  // Modal
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  language: "en",
  currency: "INR",
  autoSave: true,
  highQualityRendering: true,
  showGrid: false,
  showWireframe: false,
};

export const useUIStore = create<UIState & UIActions>()((set, get) => ({
  // Initial state
  isCustomizationPanelOpen: false,
  isProjectsPanelOpen: false,
  isSettingsPanelOpen: false,
  isMobileMenuOpen: false,
  activeTab: "design",
  notifications: [],
  preferences: DEFAULT_PREFERENCES,
  isLoading: false,
  loadingMessage: "",
  activeModal: null,
  modalData: null,

  // Panel actions
  openCustomizationPanel: () => set({ isCustomizationPanelOpen: true }),
  closeCustomizationPanel: () => set({ isCustomizationPanelOpen: false }),
  toggleCustomizationPanel: () =>
    set((s) => ({ isCustomizationPanelOpen: !s.isCustomizationPanelOpen })),
  openProjectsPanel: () => set({ isProjectsPanelOpen: true }),
  closeProjectsPanel: () => set({ isProjectsPanelOpen: false }),
  openSettingsPanel: () => set({ isSettingsPanelOpen: true }),
  closeSettingsPanel: () => set({ isSettingsPanelOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Notification actions
  addNotification: (notification) => {
    const id = generateId();
    const newNotification: Notification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  // Preference actions
  setPreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),

  // Loading actions
  setLoading: (loading, message = "") =>
    set({ isLoading: loading, loadingMessage: message }),

  // Modal actions
  openModal: (modalId, data) =>
    set({ activeModal: modalId, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
