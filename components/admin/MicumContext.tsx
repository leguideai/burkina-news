"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface ActiveEditorConfig {
  sectionId: 'article' | 'project' | 'indicator' | 'fil' | 'issue' | 'none';
  sectionTitle: string;
  canInsert: boolean;
  currentData?: Record<string, any>;
  insertToBody?: (text: string) => void;
  replaceField?: (field: string, value: string) => void;
  applyAll?: (data: any) => void;
}

interface MicumContextType {
  isOpen: boolean;
  openMicum: () => void;
  closeMicum: () => void;
  toggleMicum: () => void;
  activeEditor: ActiveEditorConfig | null;
  registerEditor: (config: ActiveEditorConfig) => () => void;
  updateEditorData: (data: Record<string, any>) => void;
}

const MicumContext = createContext<MicumContextType | null>(null);

export function MicumProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState<ActiveEditorConfig | null>(null);
  const activeEditorRef = useRef<ActiveEditorConfig | null>(null);

  const openMicum = useCallback(() => setIsOpen(true), []);
  const closeMicum = useCallback(() => setIsOpen(false), []);
  const toggleMicum = useCallback(() => setIsOpen(prev => !prev), []);

  const registerEditor = useCallback((config: ActiveEditorConfig) => {
    setActiveEditor(config);
    activeEditorRef.current = config;

    return () => {
      setActiveEditor(null);
      activeEditorRef.current = null;
    };
  }, []);

  const updateEditorData = useCallback((data: Record<string, any>) => {
    setActiveEditor(prev => {
      if (!prev) return null;
      const next = { ...prev, currentData: { ...prev.currentData, ...data } };
      activeEditorRef.current = next;
      return next;
    });
  }, []);

  return (
    <MicumContext.Provider
      value={{
        isOpen,
        openMicum,
        closeMicum,
        toggleMicum,
        activeEditor,
        registerEditor,
        updateEditorData
      }}
    >
      {children}
    </MicumContext.Provider>
  );
}

export function useMicum() {
  const context = useContext(MicumContext);
  if (!context) {
    throw new Error('useMicum must be used within a MicumProvider');
  }
  return context;
}
