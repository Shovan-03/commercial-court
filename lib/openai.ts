import { apiRequest } from "./queryClient";

// Functions for OpenAI integration with the server

export async function analyzeDocument(documentId: string) {
  const response = await apiRequest(
    "POST",
    `/api/documents/${documentId}/analyze`,
    {}
  );
  return response.json();
}

export async function translateDocument(documentId: string, targetLanguage: string) {
  const response = await apiRequest(
    "POST",
    `/api/documents/${documentId}/translate`,
    { targetLanguage }
  );
  return response.json();
}

export async function findJurisdiction(documentId: string) {
  const response = await apiRequest(
    "POST",
    `/api/documents/${documentId}/jurisdiction`,
    {}
  );
  return response.json();
}

export async function getDocumentSummary(documentId: string) {
  const response = await apiRequest(
    "GET",
    `/api/documents/${documentId}/summary`,
    undefined
  );
  return response.json();
}
