// Common types used throughout the application

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type DocumentStatus = "pending" | "processing" | "processed" | "failed";

export type Document = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: DocumentStatus;
  content?: string;
};

export type DocumentAnalysis = {
  summary: string;
  keyPoints: string[];
  statutes: {
    name: string;
    description: string;
  }[];
};

export type CourtJurisdiction = {
  primary: string;
  courts: {
    name: string;
    relevance: number;
  }[];
};

export type Court = {
  id: string;
  name: string;
  jurisdictionType: string;
  location: string;
  caseTypes: string[];
};

export type ActivityLog = {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  documentId?: string;
};

export type Stats = {
  documentsProcessed: number;
  successfulAnalyses: number;
  pendingDocuments: number;
  courtsReferenced: number;
};

export type User = {
  id: string;
  name: string;
  role: string;
};
