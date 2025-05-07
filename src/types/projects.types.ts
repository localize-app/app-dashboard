// src/types/project.types.ts

export enum ProjectType {
  WEBSITE = 'website',
  WEBAPP = 'webapp',
  MOBILE_APP = 'mobile_app',
  DESKTOP_APP = 'desktop_app',
  OTHER = 'other',
}

export interface ProjectSettings {
  translationQA?: boolean;
  monthlyReport?: boolean;
  autoDetectLanguage?: boolean;
  archiveUnusedPhrases?: boolean;
  translateMetaTags?: boolean;
  translateAriaLabels?: boolean;
  translatePageTitles?: boolean;
  customizeImages?: boolean;
  customizeUrls?: boolean;
  customizeAudio?: boolean;
  dateHandling?: boolean;
  ignoreCurrency?: boolean;
}

export interface Project {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  company: string; // Company ID
  projectType: string; // Using ProjectType enum values
  websiteUrl?: string;
  projectKey?: string;
  supportedLocales?: string[]; // Array of locale codes
  isArchived?: boolean;
  members?: string[]; // Array of user IDs
  settings?: ProjectSettings;

  // Virtual fields / calculated properties
  publishedPhraseCount?: number;
  pendingPhraseCount?: number;
  phraseCount?: number;
  pageviews?: number;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Use for project creation payload
export interface CreateProjectDto {
  name: string;
  description?: string;
  company: string;
  projectType?: string;
  websiteUrl?: string;
  supportedLocales?: string[];
  settings?: ProjectSettings;
}

// Use for project update payload
export interface UpdateProjectDto {
  name?: string;
  description?: string;
  company?: string;
  projectType?: string;
  websiteUrl?: string;
  projectKey?: string;
  supportedLocales?: string[];
  isArchived?: boolean;
  members?: string[];
  settings?: Partial<ProjectSettings>;
}
