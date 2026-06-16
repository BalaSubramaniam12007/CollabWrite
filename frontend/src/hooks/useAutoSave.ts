import { useEffect, useRef } from 'react';
import { documentService } from '../services/api';

export function useAutoSave(documentId: number | null, title: string) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = (html: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (documentId) {
        documentService.updateDocument(documentId, title, html).catch(console.error);
      }
    }, 1000);
  };

  // Auto-save when the title changes independently
  useEffect(() => {
    if (documentId && title) {
      const timeout = setTimeout(() => {
        documentService.updateDocument(documentId, title, null as any).catch(console.error);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [title, documentId]);

  return { debouncedSave };
}