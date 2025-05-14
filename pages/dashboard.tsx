import { Helmet } from "react-helmet";
import StatsOverview from "@/components/dashboard/stats-overview";
import DocumentUpload from "@/components/dashboard/document-upload";
import DocumentAnalysis from "@/components/dashboard/document-analysis";
import CourtFinder from "@/components/dashboard/court-finder";
import RecentActivities from "@/components/dashboard/recent-activities";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  // Get most recently processed document to show in the document analysis component
  const { data: recentDocuments } = useQuery<any[]>({
    queryKey: ["/api/documents/recent"],
  });

  const recentProcessedDocument = recentDocuments?.find(doc => doc.status === "processed")?.id;

  return (
    <>
      <Helmet>
        <title>LexAI - AI-Driven Research Engine for Commercial Courts</title>
        <meta name="description" content="An AI-powered legal research engine for analyzing court documents, translating legal content, and identifying appropriate jurisdictions." />
      </Helmet>
      
      {/* Stats Overview */}
      <StatsOverview />
      
      {/* Document Upload Section */}
      <DocumentUpload />
      
      {/* Document Analysis Section */}
      <DocumentAnalysis documentId={recentProcessedDocument} />
      
      {/* Court Jurisdiction Finder */}
      <CourtFinder />
      
      {/* Recent AI Activities */}
      <RecentActivities />
    </>
  );
}
