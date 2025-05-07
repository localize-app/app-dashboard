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
  status: PhraseStatus;
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

export interface BatchOperation {
  operation: 'publish' | 'archive' | 'delete' | 'tag' | 'untag';
  items: { id: string }[];
  tag?: string; // For tag/untag operations
}

export interface PhraseFilterOptions {
  project?: string;
  status?: string;
  isArchived?: boolean;
  search?: string;
  tags?: string | string[];
  page?: number;
  limit?: number;
}
