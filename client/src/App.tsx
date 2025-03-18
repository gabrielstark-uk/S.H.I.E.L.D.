import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Education from "@/pages/education";
import Reports from "@/pages/reports";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import Subscription from "@/pages/subscription";
import Chat from "@/pages/chat";
import AdminDashboard from "@/pages/admin/dashboard";
import Setup from "@/pages/setup";
import TermsAndConditions from "@/pages/terms";
import PrivacyPolicy from "@/pages/privacy";
import AboutUs from "@/pages/about";
import DataHandling from "@/pages/data-handling";
import {
  RadioTower,
  BookOpen,
  FileText,
  User,
  LogOut,
  Settings,
  CreditCard,
  MessageSquare,
  ChevronDown,
  Shield
} from "lucide-react";

function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              S.H.I.E.L.D
            </a>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <Link href="/">
                <a className={`flex items-center gap-2 hover:text-primary ${location === '/' ? 'text-primary font-medium' : ''}`}>
                  <RadioTower className="h-4 w-4" />
                  Analyzer
                </a>
              </Link>
              <Link href="/education">
                <a className={`flex items-center gap-2 hover:text-primary ${location === '/education' ? 'text-primary font-medium' : ''}`}>
                  <BookOpen className="h-4 w-4" />
                  Education
                </a>
              </Link>
              <Link href="/reports">
                <a className={`flex items-center gap-2 hover:text-primary ${location === '/reports' ? 'text-primary font-medium' : ''}`}>
                  <FileText className="h-4 w-4" />
                  Reports
                </a>
              </Link>
              <Link href="/chat">
                <a className={`flex items-center gap-2 hover:text-primary ${location === '/chat' ? 'text-primary font-medium' : ''}`}>
                  <MessageSquare className="h-4 w-4" />
                  AI Chat
                </a>
              </Link>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage || ''} alt={user.firstName || 'User'} />
                      <AvatarFallback>{user.firstName?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user.firstName || user.email.split('@')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <div>{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="flex items-center gap-2 cursor-pointer w-full">
                        <User className="h-4 w-4" />
                        Profile
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscription">
                      <a className="flex items-center gap-2 cursor-pointer w-full">
                        <CreditCard className="h-4 w-4" />
                        Subscription
                        <Badge className="ml-auto" variant={user.subscriptionTier === 'free' ? 'outline' : 'default'}>
                          {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                        </Badge>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === 'admin' || user.role === 'sudo') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="flex items-center gap-2 cursor-pointer w-full">
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                          {user.role === 'sudo' && (
                            <Badge className="ml-auto" variant="destructive">
                              Sudo
                            </Badge>
                          )}
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between">
            <Link href="/">
              <a className={`flex flex-col items-center gap-1 text-xs ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                <RadioTower className="h-5 w-5" />
                Analyzer
              </a>
            </Link>
            <Link href="/education">
              <a className={`flex flex-col items-center gap-1 text-xs ${location === '/education' ? 'text-primary' : 'text-muted-foreground'}`}>
                <BookOpen className="h-5 w-5" />
                Education
              </a>
            </Link>
            <Link href="/reports">
              <a className={`flex flex-col items-center gap-1 text-xs ${location === '/reports' ? 'text-primary' : 'text-muted-foreground'}`}>
                <FileText className="h-5 w-5" />
                Reports
              </a>
            </Link>
            <Link href="/chat">
              <a className={`flex flex-col items-center gap-1 text-xs ${location === '/chat' ? 'text-primary' : 'text-muted-foreground'}`}>
                <MessageSquare className="h-5 w-5" />
                AI Chat
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
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/chat" component={Chat} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/setup" component={Setup} />
      <Route path="/terms" component={TermsAndConditions} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/about" component={AboutUs} />
      <Route path="/data-handling" component={DataHandling} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Router />
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">S.H.I.E.L.D</span>
              <span className="text-sm text-muted-foreground ml-2">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <Link href="/about">
                <a className="hover:text-foreground">About Us</a>
              </Link>
              <Link href="/privacy">
                <a className="hover:text-foreground">Privacy Policy</a>
              </Link>
              <Link href="/terms">
                <a className="hover:text-foreground">Terms of Service</a>
              </Link>
              <Link href="/data-handling">
                <a className="hover:text-foreground">Data Handling</a>
              </Link>
              <a href="mailto:contact@shield-protection.co.uk" className="hover:text-foreground">Contact</a>
            </div>
          </div>
          <div className="mt-4 text-xs text-center text-muted-foreground">
            S.H.I.E.L.D Protection Ltd. is registered in England and Wales (Company No. 12345678)
            <br />
            All prices are in GBP (£) and include VAT where applicable.
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
