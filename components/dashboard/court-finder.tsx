import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Court } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Types for filters
interface CourtFilters {
  courtType?: string;
  region?: string;
  searchTerm: string;
}

export default function CourtFinder() {
  const [filters, setFilters] = useState<CourtFilters>({
    searchTerm: "",
  });

  const { data: courts, isLoading } = useQuery<Court[]>({
    queryKey: ["/api/courts", filters],
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, courtType: value || undefined });
  };

  const handleRegionChange = (value: string) => {
    setFilters({ ...filters, region: value || undefined });
  };

  const handleViewDetails = (courtId: string) => {
    // Handle viewing court details
    window.location.href = `/court-finder?id=${courtId}`;
  };

  return (
    <Card className="border border-gray-100 mb-6">
      <CardHeader className="bg-gray-50 border-b border-gray-200 p-4">
        <CardTitle className="text-lg font-medium text-navy-900">Court Jurisdiction Finder</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for courts by name, region, or jurisdiction..."
                className="pl-10 pr-4 py-2"
                value={filters.searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Select value={filters.courtType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Court Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="high_court">High Court</SelectItem>
                <SelectItem value="district">District Court</SelectItem>
                <SelectItem value="commercial">Commercial Court</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.region} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="State/Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Map View */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>Interactive jurisdiction map would be displayed here</p>
            <p className="text-xs mt-2">Click on a region to view available courts</p>
          </div>
        </div>
        
        {/* Court Results Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court Name</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction Type</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Types</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {courts && courts.length > 0 ? (
                  courts.map((court) => (
                    <TableRow key={court.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap">{court.name}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          court.jurisdictionType === "High Court" 
                            ? "bg-navy-100 text-navy-800" 
                            : court.jurisdictionType === "Commercial Court"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {court.jurisdictionType}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">{court.location}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {court.caseTypes.map((caseType, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs rounded-full ${
                                caseType === "Commercial" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : caseType === "Corporate"
                                  ? "bg-purple-100 text-purple-800"
                                  : caseType === "Maritime"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {caseType}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Button 
                          variant="link" 
                          className="text-navy-600 hover:text-navy-900"
                          onClick={() => handleViewDetails(court.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No courts found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
