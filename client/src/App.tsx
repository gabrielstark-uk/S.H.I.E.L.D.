import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Education from "@/pages/education";
import Reports from "@/pages/reports";
import { RadioTower, BookOpen, FileText } from "lucide-react";

function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold flex items-center gap-2">
              <RadioTower className="h-6 w-6" />
              FrequencyGuard
            </a>
          </Link>
          
          <div className="flex gap-6">
            <Link href="/">
              <a className="flex items-center gap-2 hover:text-primary">
                <RadioTower className="h-4 w-4" />
                Analyzer
              </a>
            </Link>
            <Link href="/education">
              <a className="flex items-center gap-2 hover:text-primary">
                <BookOpen className="h-4 w-4" />
                Education
              </a>
            </Link>
            <Link href="/reports">
              <a className="flex items-center gap-2 hover:text-primary">
                <FileText className="h-4 w-4" />
                Reports
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/education" component={Education} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
