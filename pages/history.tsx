import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { ActivityLog } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activities"],
  });

  const filteredActivities = activities?.filter((activity) => {
    let matchesSearch = true;
    let matchesAction = true;
    let matchesDate = true;

    if (searchTerm) {
      matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (actionFilter) {
      matchesAction = activity.action === actionFilter;
    }

    if (date) {
      const activityDate = new Date(activity.timestamp);
      matchesDate = (
        activityDate.getFullYear() === date.getFullYear() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getDate() === date.getDate()
      );
    }

    return matchesSearch && matchesAction && matchesDate;
  });

  // Helper function to get the background color for activity type
  const getActivityBgColor = (action: string) => {
    switch (action) {
      case "document_analyzed":
        return "bg-navy-100 text-navy-800";
      case "jurisdiction_analyzed":
        return "bg-blue-100 text-blue-800";
      case "document_uploaded":
        return "bg-yellow-100 text-yellow-800";
      case "document_translated":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format action type for display
  const formatActionType = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <Helmet>
        <title>Activity History - LexAI</title>
        <meta name="description" content="View your document analysis history and AI activities in the LexAI platform." />
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Activity History</h1>
          <p className="text-gray-600">View a complete record of your document analysis history and AI activities.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Activities Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                    <SelectItem value="document_analyzed">Document Analyzed</SelectItem>
                    <SelectItem value="jurisdiction_analyzed">Jurisdiction Analyzed</SelectItem>
                    <SelectItem value="document_translated">Document Translated</SelectItem>
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-36 justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                    {date && (
                      <div className="p-3 border-t border-gray-100">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs w-full"
                          onClick={() => setDate(undefined)}
                        >
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : filteredActivities && filteredActivities.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Activity Type</TableHead>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead>Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(activity.timestamp), "PPP p")}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${getActivityBgColor(activity.action)}`}>
                            {formatActionType(activity.action)}
                          </span>
                        </TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell>
                          {activity.documentId ? (
                            <Link href={`/research-engine?document=${activity.documentId}`}>
                              <Button variant="ghost" size="sm" className="text-navy-600 hover:text-navy-800 p-0">
                                <ExternalLink className="h-4 w-4 mr-1" /> View
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Activities Found</h3>
                <p className="text-gray-500">
                  {searchTerm || actionFilter || date
                    ? "No activities match your filter criteria."
                    : "No document activities have been recorded yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
