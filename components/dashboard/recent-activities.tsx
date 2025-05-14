import { useQuery } from "@tanstack/react-query";
import { ActivityLog } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activities/recent"],
  });

  // Helper function to get the right color for the activity dot
  const getActivityDotColor = (action: string) => {
    switch (action) {
      case "document_analyzed":
        return "bg-navy-600";
      case "jurisdiction_analyzed":
        return "bg-blue-500";
      case "document_uploaded":
        return "bg-yellow-500";
      case "document_translated":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-serif font-bold text-navy-900">Recent AI Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative border-l-2 border-gray-200 pl-4 pb-2">
                <Skeleton className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full" />
                <div>
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="relative border-l-2 border-gray-200 pl-4 pb-2">
                <div className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${getActivityDotColor(activity.action)} border-2 border-white`}></div>
                <div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  <p className="text-sm font-medium">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No recent activities</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/history">
            <Button variant="link" className="text-navy-600 hover:text-navy-900 font-medium">
              View All Activities
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
