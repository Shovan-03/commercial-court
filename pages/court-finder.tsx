import { Helmet } from "react-helmet";
import CourtFinderComponent from "@/components/dashboard/court-finder";

export default function CourtFinderPage() {
  return (
    <>
      <Helmet>
        <title>Court Jurisdiction Finder - LexAI</title>
        <meta name="description" content="Find appropriate courts and jurisdictions for commercial cases based on case details and geographical location." />
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Court Jurisdiction Finder</h1>
          <p className="text-gray-600">Find the appropriate courts and jurisdictions for your commercial cases based on case details and geographical location.</p>
        </div>
        
        <CourtFinderComponent />
      </div>
    </>
  );
}
