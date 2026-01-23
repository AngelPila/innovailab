import { create } from 'zustand';

type InterfaceVersion = 'basic' | 'advanced' | null;

interface InterfaceStore {
  selectedVersion: InterfaceVersion;
  selectVersion: (version: InterfaceVersion) => void;
  resetVersion: () => void;
}

export const useInterfaceStore = create<InterfaceStore>((set) => ({
  selectedVersion: null,
  
  selectVersion: (version: InterfaceVersion) => {
    set({ selectedVersion: version });
  },
  
  resetVersion: () => {
    set({ selectedVersion: null });
  },
}));