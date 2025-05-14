import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@/lib/types";
import DocumentAnalysis from "@/components/dashboard/document-analysis";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FileText, AlertTriangle, Building2, Download } from "lucide-react";
import { analyzeDocument, translateDocument } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

export default function ResearchEnginePage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Parse document ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const docId = params.get("document");
    if (docId) {
      setSelectedDocumentId(docId);
    }
  }, [location]);

  // Fetch all user documents
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setLocation(`/research-engine?document=${documentId}`);
  };

  const handleAnalyzeDocument = async () => {
    if (!selectedDocumentId) return;
    
    try {
      toast({ title: "Analyzing document", description: "This may take a few moments..." });
      await analyzeDocument(selectedDocumentId);
      toast({ title: "Analysis complete", description: "Document has been processed successfully" });
    } catch (error) {
      toast({ 
        title: "Analysis failed", 
        description: error instanceof Error ? error.message : "An unknown error occurred", 
        variant: "destructive" 
      });
    }
  };

  const handleTranslateDocument = async (targetLanguage: string) => {
    if (!selectedDocumentId) return;
    
    try {
      toast({ 
        title: "Translating document", 
        description: `Translating to ${targetLanguage}. This may take a few moments...` 
      });
      await translateDocument(selectedDocumentId, targetLanguage);
      toast({ 
        title: "Translation complete", 
        description: `Document has been translated to ${targetLanguage}` 
      });
    } catch (error) {
      toast({ 
        title: "Translation failed", 
        description: error instanceof Error ? error.message : "An unknown error occurred", 
        variant: "destructive" 
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Research Engine - LexAI</title>
        <meta name="description" content="AI-powered legal research engine for analyzing court documents and legal texts." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy-900">AI Research Engine</h1>
            <p className="text-gray-600">Analyze legal documents to extract insights, summaries, and court jurisdictions.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedDocumentId || ""}
              onValueChange={handleDocumentSelect}
              disabled={isLoading || !documents?.length}
            >
              <SelectTrigger className="w-full sm:w-60">
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {documents?.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleAnalyzeDocument}
              disabled={!selectedDocumentId}
              className="bg-navy-900 hover:bg-navy-800"
            >
              <Search className="mr-2 h-4 w-4" /> Analyze
            </Button>
          </div>
        </div>
        
        {selectedDocumentId ? (
          <DocumentAnalysis documentId={selectedDocumentId} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">No Document Selected</h2>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Select a document from your library or upload a new document to analyze with our AI engine.
              </p>
              <Button onClick={() => setLocation("/document-upload")}>
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}
        
        {selectedDocumentId && (
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="actions">
                <TabsList className="mb-6">
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="translation">Translation</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 px-4 flex flex-col items-center text-center"
                      onClick={handleAnalyzeDocument}
                    >
                      <Search className="h-8 w-8 mb-2 text-navy-600" />
                      <span className="font-medium">Re-Analyze Document</span>
                      <span className="text-xs text-gray-500 mt-1">Process with latest AI model</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 px-4 flex flex-col items-center text-center"
                      onClick={() => setLocation(`/court-finder?document=${selectedDocumentId}`)}
                    >
                      <Building2 className="h-8 w-8 mb-2 text-navy-600" />
                      <span className="font-medium">Find Jurisdiction</span>
                      <span className="text-xs text-gray-500 mt-1">Identify appropriate courts</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 px-4 flex flex-col items-center text-center"
                      onClick={() => window.open(`/api/documents/${selectedDocumentId}/export-pdf`, '_blank')}
                    >
                      <Download className="h-8 w-8 mb-2 text-navy-600" />
                      <span className="font-medium">Export Analysis</span>
                      <span className="text-xs text-gray-500 mt-1">Download as PDF report</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="translation" className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Translate this document to another language:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => handleTranslateDocument("hindi")}
                    >
                      <span className="mr-2">🇮🇳</span> Hindi
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => handleTranslateDocument("spanish")}
                    >
                      <span className="mr-2">🇪🇸</span> Spanish
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => handleTranslateDocument("french")}
                    >
                      <span className="mr-2">🇫🇷</span> French
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => handleTranslateDocument("german")}
                    >
                      <span className="mr-2">🇩🇪</span> German
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => handleTranslateDocument("japanese")}
                    >
                      <span className="mr-2">🇯🇵</span> Japanese
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Advanced options</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          These options are for experienced users and may affect the analysis results.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">AI Model Version</label>
                      <Select defaultValue="gpt-4o">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Analysis Depth</label>
                      <Select defaultValue="standard">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
