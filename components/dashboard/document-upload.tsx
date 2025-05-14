import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Document, DocumentStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, FileText, FileSpreadsheet, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Helper function to get file icon based on file type
const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) return File;
  if (fileType.includes("word") || fileType.includes("docx")) return FileText;
  return FileText;
};

// Status badge component
const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  const statusConfig = {
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
    <div className={`flex items-center space-x-1 px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>
      {config.animation && (
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
      )}
      <span>{config.label}</span>
    </div>
  );
};

export default function DocumentUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentDocuments, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents/recent"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to upload document");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded and queued for processing.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/recent"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const formData = new FormData();
    
    // Check file types and size
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `File "${file.name}" is not supported. Please upload PDF, DOCX, or TXT files.`,
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File "${file.name}" exceeds the 50MB limit.`,
          variant: "destructive",
        });
        return;
      }
      
      formData.append("files", file);
    });
    
    if (formData.has("files")) {
      uploadMutation.mutate(formData);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleViewDocument = (documentId: string) => {
    // Navigate to document view page
    window.location.href = `/research-engine?document=${documentId}`;
  };

  return (
    <Card className="mb-6 border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-serif font-bold text-navy-900">Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragActive ? "border-navy-400 bg-navy-50" : "border-gray-300 hover:border-navy-400"
          }`}
          onClick={handleBrowseClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-2">
            <Upload className="h-10 w-10 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700">Drag and drop your files here</h3>
            <p className="text-sm text-gray-500">or</p>
            <Button 
              variant="default" 
              className="bg-navy-900 hover:bg-navy-800 text-white"
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOCX, TXT (Max 50MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleChange}
          />
        </div>
        
        {/* Recently Uploaded Files */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Recently Uploaded</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="ml-3 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentDocuments && recentDocuments.length > 0 ? (
            <div className="space-y-3">
              {recentDocuments.map((document) => {
                const FileIcon = getFileIcon(document.type);
                const canView = document.status === "processed";
                
                return (
                  <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 rounded bg-navy-100 text-navy-700">
                        <FileIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800">{document.name}</h4>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(document.size)} • Uploaded {formatDistanceToNow(new Date(document.uploadedAt))} ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={document.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!canView}
                        onClick={() => handleViewDocument(document.id)}
                        className={canView ? "text-gray-500 hover:text-navy-700" : "text-gray-400 cursor-not-allowed"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-md bg-gray-50">
              <p className="text-gray-500">No documents uploaded yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
