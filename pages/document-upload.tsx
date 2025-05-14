import { Helmet } from "react-helmet";
import DocumentUploadComponent from "@/components/dashboard/document-upload";

export default function DocumentUploadPage() {
  return (
    <>
      <Helmet>
        <title>Document Upload - LexAI</title>
        <meta name="description" content="Upload legal documents for AI analysis. Supports PDF, DOCX, and TXT formats." />
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-serif font-bold text-navy-900">Document Upload</h1>
        <p className="text-gray-600">Upload your legal documents for AI analysis, translation, and court jurisdiction identification.</p>
        
        <DocumentUploadComponent />
      </div>
    </>
  );
}
