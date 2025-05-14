import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/lib/types";
import { FileText, CheckCheck, Clock, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100">
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Fallback data if server returns null
  const statsData = stats || {
    documentsProcessed: 0,
    successfulAnalyses: 0,
    pendingDocuments: 0,
    courtsReferenced: 0,
  };

  const statItems = [
    {
      title: "Documents Processed",
      value: statsData.documentsProcessed,
      icon: FileText,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Successful Analyses",
      value: statsData.successfulAnalyses,
      icon: CheckCheck,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Pending Documents",
      value: statsData.pendingDocuments,
      icon: Clock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Courts Referenced",
      value: statsData.courtsReferenced,
      icon: Building2,
      bgColor: "bg-navy-100",
      textColor: "text-navy-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={index} className="border border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${item.bgColor} ${item.textColor}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
