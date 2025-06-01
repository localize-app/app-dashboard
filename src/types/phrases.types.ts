// src/types/phrases.types.ts - Updated with Swagger schema
export enum TranslationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review',
}

export enum PhraseStatus {
  PUBLISHED = 'published',
  PENDING = 'pending',
  NEEDS_REVIEW = 'needs_review',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

// Overall status based on Swagger schema
export enum PhraseOverallStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  NEEDS_ATTENTION = 'needs_attention',
  READY = 'ready',
  UNTRANSLATED = 'untranslated',
}

export interface Translation {
  text: string;
  status: TranslationStatus;
  isHuman: boolean;
  lastModified?: string;
  modifiedBy?: string;
  isReviewed?: boolean;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

export interface PhraseLocation {
  url: string;
  path?: string;
  context?: string;
  element?: string;
  timestamp: string;
}

export interface PhraseOccurrences {
  count: number;
  firstSeen: string;
  lastSeen: string;
  locations: PhraseLocation[];
}

export interface Phrase {
  id: string;
  _id?: string;
  key: string;
  sourceText: string;
  context?: string;
  project: string;
  status?: PhraseStatus;
  overallStatus?: PhraseOverallStatus; // New field from Swagger
  isArchived: boolean;
  translations: Record<string, Translation>;
  tags: string[];
  lastSeenAt?: string;
  sourceUrl?: string;
  screenshot?: string;
  occurrences?: PhraseOccurrences;
  sourceType?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Batch operation types based on Swagger schema
export interface BatchOperation {
  operation:
    | 'approve_translations'
    | 'reject_translations'
    | 'archive'
    | 'delete'
    | 'tag'
    | 'untag';
  items: { id: string }[];
  tag?: string; // For tag/untag operations
  locale?: string; // For translation operations
}

export interface PhraseFilterOptions {
  project?: string;
  limit?: number;
  page?: number;
  tags?: string;
  search?: string;
  isArchived?: boolean;
  locale?: string;
  translationStatus?: TranslationStatus;
}

// Create phrase DTO based on Swagger schema
export interface CreatePhraseDto {
  key: string;
  sourceText: string;
  context?: string;
  project: string;
  isArchived?: boolean;
  translations?: Record<string, Translation>;
  tags?: string[];
  sourceUrl?: string;
  screenshot?: string;
}

// Update phrase DTO based on Swagger schema
export interface UpdatePhraseDto {
  key?: string;
  sourceText?: string;
  context?: string;
  project?: string;
  isArchived?: boolean;
  translations?: Record<string, Translation>;
  tags?: string[];
  sourceUrl?: string;
  screenshot?: string;
}

// Add translation DTO based on Swagger schema
export interface AddTranslationDto {
  text: string;
  status?: TranslationStatus;
  isHuman?: boolean;
}

// Update status DTO based on Swagger schema
export interface UpdateStatusDto {
  status: PhraseStatus;
}

// Phrase statistics based on Swagger schema
export interface PhraseStats {
  total: number;
  untranslated: number;
  pending: number;
  approved: number;
  needsAttention: number;
  ready: number;
  byLocale: Record<
    string,
    {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      needsReview: number;
    }
  >;
}

// Export/Import types
export interface ExportOptions {
  locales?: string; // comma-separated locale codes
  status?: string; // comma-separated status values
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors?: number;
  message?: string;
}
