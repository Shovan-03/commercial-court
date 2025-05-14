import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Document, DocumentStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Download, Trash2, Search, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Status badge component
const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  const statusConfig: Record<DocumentStatus, {
    bg: string;
    text: string;
    label: string;
    animation?: boolean;
  }> = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pending",
    },
    processing: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Processing",
      animation: true,
    },
    processed: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Processed",
    },
    failed: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Failed",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full inline-flex items-center`}>
      {config.animation && (
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mr-1"></div>
      )}
      <span>{config.label}</span>
    </div>
  );
};

export default function MyDocumentsPage() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const filteredDocuments = documents?.filter((doc) => {
    let matchesSearch = true;
    let matchesStatus = true;
    let matchesType = true;

    if (searchTerm) {
      matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (statusFilter) {
      matchesStatus = doc.status === statusFilter;
    }

    if (typeFilter) {
      matchesType = doc.type.includes(typeFilter);
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleView = (documentId: string) => {
    setLocation(`/research-engine?document=${documentId}`);
  };

  const handleDownload = (documentId: string) => {
    window.open(`/api/documents/${documentId}/download`, '_blank');
  };

  const handleDelete = (documentId: string) => {
    // Handle document deletion - would use mutation in real implementation
    alert(`Delete document ${documentId}`);
  };

  return (
    <>
      <Helmet>
        <title>My Documents - LexAI</title>
        <meta name="description" content="View and manage your uploaded legal documents for AI analysis." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy-900">My Documents</h1>
            <p className="text-gray-600">View and manage your uploaded legal documents.</p>
          </div>
          
          <Button 
            onClick={() => setLocation("/document-upload")}
            className="bg-navy-900 hover:bg-navy-800"
          >
            <FileText className="mr-2 h-4 w-4" /> Upload New Document
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Document Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="border border-gray-200">
                        <CardContent className="p-4 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-8 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredDocuments && filteredDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="border border-gray-200 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-navy-900 truncate" title={doc.name}>
                                {doc.name}
                              </h3>
                              <StatusBadge status={doc.status} />
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-4">
                              {formatFileSize(doc.size)} • Uploaded {formatDistanceToNow(new Date(doc.uploadedAt))} ago
                            </p>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(doc.id)}
                                disabled={doc.status !== "processed"}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc.id)}
                              >
                                <Download className="h-3.5 w-3.5 mr-1" /> Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(doc.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Documents Found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter || typeFilter
                        ? "No documents match your filter criteria."
                        : "You haven't uploaded any documents yet."}
                    </p>
                    {!(searchTerm || statusFilter || typeFilter) && (
                      <Button 
                        onClick={() => setLocation("/document-upload")}
                        className="bg-navy-900 hover:bg-navy-800"
                      >
                        Upload Your First Document
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="table">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : filteredDocuments && filteredDocuments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium truncate max-w-[200px]" title={doc.name}>
                              {doc.name}
                            </TableCell>
                            <TableCell>{formatFileSize(doc.size)}</TableCell>
                            <TableCell className="uppercase">{doc.type.split('/')[1]}</TableCell>
                            <TableCell>{formatDistanceToNow(new Date(doc.uploadedAt))} ago</TableCell>
                            <TableCell>
                              <StatusBadge status={doc.status} />
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(doc.id)}
                                  disabled={doc.status !== "processed"}
                                  className={doc.status === "processed" ? "text-navy-700" : "text-gray-400"}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(doc.id)}
                                  className="text-navy-700"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Documents Found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter || typeFilter
                        ? "No documents match your filter criteria."
                        : "You haven't uploaded any documents yet."}
                    </p>
                    {!(searchTerm || statusFilter || typeFilter) && (
                      <Button 
                        onClick={() => setLocation("/document-upload")}
                        className="bg-navy-900 hover:bg-navy-800"
                      >
                        Upload Your First Document
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
