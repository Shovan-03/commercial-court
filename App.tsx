import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/app-layout";
import Dashboard from "@/pages/dashboard";
import DocumentUpload from "@/pages/document-upload";
import ResearchEngine from "@/pages/research-engine";
import CourtFinder from "@/pages/court-finder";
import MyDocuments from "@/pages/my-documents";
import History from "@/pages/history";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/document-upload" component={DocumentUpload} />
        <Route path="/research-engine" component={ResearchEngine} />
        <Route path="/court-finder" component={CourtFinder} />
        <Route path="/my-documents" component={MyDocuments} />
        <Route path="/history" component={History} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
