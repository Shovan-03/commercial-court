import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Document, DocumentAnalysis, CourtJurisdiction } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, Printer, ZoomIn, 
  File, Bookmark, Building2, BookOpen
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DocumentAnalysisProps {
  documentId?: string;
}

export default function DocumentAnalysisComponent({ documentId }: DocumentAnalysisProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const { data: document, isLoading: documentLoading } = useQuery<Document>({
    queryKey: [`/api/documents/${documentId}`],
    enabled: !!documentId,
  });

  const { data: analysis, isLoading: analysisLoading } = useQuery<DocumentAnalysis>({
    queryKey: [`/api/documents/${documentId}/analysis`],
    enabled: !!documentId,
  });

  const { data: jurisdiction, isLoading: jurisdictionLoading } = useQuery<CourtJurisdiction>({
    queryKey: [`/api/documents/${documentId}/jurisdiction`],
    enabled: !!documentId,
  });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (documentId) {
      window.open(`/api/documents/${documentId}/download`, '_blank');
    }
  };

  if (!documentId) {
    return (
      <Card className="border border-gray-100 mb-6">
        <div className="p-8 text-center">
          <File className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Document Selected</h3>
          <p className="text-sm text-gray-400">Upload or select a document to view its analysis</p>
        </div>
      </Card>
    );
  }

  if (documentLoading || analysisLoading || jurisdictionLoading) {
    return (
      <Card className="border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
            <div className="p-6 h-[500px]">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-28 rounded" />
              </div>
            </div>
            <div className="p-6 h-[500px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-20 w-full rounded" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row">
        {/* Document Viewer Panel */}
        <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-navy-900">Document Viewer</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4 text-gray-500 hover:text-navy-700" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4 text-gray-500 hover:text-navy-700" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4 text-gray-500 hover:text-navy-700" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Document Content */}
          <div className="p-6 h-[500px] overflow-y-auto">
            {document && document.content ? (
              <div 
                className="text-sm text-gray-800 leading-relaxed space-y-4 font-serif"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
                dangerouslySetInnerHTML={{ __html: document.content }}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Document content not available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Analysis Results Panel */}
        <div className="lg:w-1/2">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-navy-900">AI Analysis Results</h3>
              <Button 
                size="sm" 
                className="px-3 py-1 bg-navy-900 text-white text-sm rounded hover:bg-navy-800"
              >
                Export Report
              </Button>
            </div>
          </div>
          
          {/* Analysis Content */}
          <div className="p-6 h-[500px] overflow-y-auto">
            <Tabs defaultValue="summary" className="space-y-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="keyPoints">Key Points</TabsTrigger>
                <TabsTrigger value="courts">Courts</TabsTrigger>
                <TabsTrigger value="statutes">Statutes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-3">
                <h4 className="text-base font-semibold text-navy-900 flex items-center">
                  <File className="mr-2 h-5 w-5" /> Case Summary
                </h4>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-sm">
                  {analysis?.summary || "No summary available"}
                </div>
              </TabsContent>
              
              <TabsContent value="keyPoints" className="space-y-3">
                <h4 className="text-base font-semibold text-navy-900 flex items-center">
                  <Bookmark className="mr-2 h-5 w-5" /> Key Points
                </h4>
                <ul className="space-y-2 text-sm">
                  {analysis?.keyPoints && analysis.keyPoints.length > 0 ? (
                    analysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5 mr-2 text-green-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No key points available</li>
                  )}
                </ul>
              </TabsContent>
              
              <TabsContent value="courts" className="space-y-3">
                <h4 className="text-base font-semibold text-navy-900 flex items-center">
                  <Building2 className="mr-2 h-5 w-5" /> Applicable Court Jurisdictions
                </h4>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  {jurisdiction ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Primary Jurisdiction:</span>
                        <span className="px-3 py-1 bg-navy-100 text-navy-800 text-xs rounded-full">
                          {jurisdiction.primary}
                        </span>
                      </div>
                      <div className="space-y-4 text-sm">
                        {jurisdiction.courts.map((court, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center">
                              <span>{court.name}</span>
                              <span className={court.relevance >= 80 ? "text-green-600" : "text-yellow-600"}>
                                {court.relevance}% Relevance
                              </span>
                            </div>
                            <Progress 
                              value={court.relevance} 
                              className="h-1.5 mt-1"
                              indicatorClassName={court.relevance >= 80 ? "bg-green-600" : "bg-yellow-600"} 
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>No jurisdiction data available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="statutes" className="space-y-3">
                <h4 className="text-base font-semibold text-navy-900 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" /> Relevant Statutes
                </h4>
                <div className="space-y-2 text-sm">
                  {analysis?.statutes && analysis.statutes.length > 0 ? (
                    analysis.statutes.map((statute, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200 flex items-center">
                        <div className="p-2 bg-gold-100 rounded text-gold-800 mr-3">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{statute.name}</p>
                          <p className="text-xs text-gray-500">{statute.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>No relevant statutes found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Card>
  );
}
