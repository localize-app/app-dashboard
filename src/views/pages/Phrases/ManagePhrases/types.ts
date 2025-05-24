// src/views/pages/Phrases/ManagePhrases/types.ts
export interface BatchAction {
  key: string;
  label: string;
  operation: string;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  confirmMessage?: string;
}
