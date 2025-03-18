import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, BookOpen, Shield, Radio, AlertTriangle } from 'lucide-react';
import { SubscriptionPlans } from './subscription-plans';

interface Resource {
  id: number;
  title: string;
  content: string;
  category: string;
  accessLevel: string;
  createdAt: string;
  updatedAt: string;
}

export function EducationalResources() {
  const { user, token } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lockedResourceId, setLockedResourceId] = useState<number | null>(null);

  // Fetch educational resources
  useEffect(() => {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/education', {
      headers
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch educational resources');
        }
        return response.json();
      })
      .then(data => {
        setResources(data);
        if (data.length > 0 && !selectedResource) {
          setSelectedResource(data[0]);
        }
      })
      .catch(err => {
        console.error('Error fetching educational resources:', err);
        setError('Failed to load educational resources. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const handleResourceSelect = async (resourceId: number) => {
    // If already selected, do nothing
    if (selectedResource?.id === resourceId) return;

    setIsLoading(true);
    setError(null);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`/api/education/${resourceId}`, {
        headers
      });

      if (response.status === 403) {
        // Resource requires higher subscription
        setLockedResourceId(resourceId);
        setShowUpgradeModal(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch resource');
      }

      const data = await response.json();
      setSelectedResource(data);
    } catch (err) {
      console.error('Error fetching resource:', err);
      setError('Failed to load resource. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset selected resource when changing categories
    if (category === 'all') {
      setSelectedResource(resources[0] || null);
    } else {
      const filteredResources = resources.filter(r => r.category === category);
      setSelectedResource(filteredResources[0] || null);
    }
  };

  const getFilteredResources = () => {
    if (activeCategory === 'all') {
      return resources;
    }
    return resources.filter(resource => resource.category === activeCategory);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technology':
        return <Radio className="h-4 w-4" />;
      case 'protection':
        return <Shield className="h-4 w-4" />;
      case 'science':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getAccessLevelBadge = (accessLevel: string) => {
    switch (accessLevel) {
      case 'free':
        return <Badge variant="outline" className="ml-2">Free</Badge>;
      case 'basic':
        return <Badge variant="outline" className="ml-2 bg-blue-100">Basic</Badge>;
      case 'premium':
        return <Badge variant="outline" className="ml-2 bg-purple-100">Premium</Badge>;
      case 'enterprise':
        return <Badge variant="outline" className="ml-2 bg-amber-100">Enterprise</Badge>;
      default:
        return null;
    }
  };

  if (isLoading && resources.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && resources.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">Error Loading Resources</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const filteredResources = getFilteredResources();
  const categories = Array.from(new Set(resources.map(r => r.category)));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Educational Resources</h1>
        <p className="text-muted-foreground">
          Learn about audio-based technologies, potential threats, and how to protect yourself.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
        <div className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Categories</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                {getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>
                  {filteredResources.length} {activeCategory === 'all' ? 'resources' : `${activeCategory} resources`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredResources.map(resource => (
                    <Button
                      key={resource.id}
                      variant={selectedResource?.id === resource.id ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleResourceSelect(resource.id)}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">{getCategoryIcon(resource.category)}</div>
                        <div>
                          <div className="font-medium flex items-center">
                            {resource.title}
                            {getAccessLevelBadge(resource.accessLevel)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(resource.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedResource ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedResource.title}</CardTitle>
                    {getAccessLevelBadge(selectedResource.accessLevel)}
                  </div>
                  <CardDescription>
                    Last updated: {new Date(selectedResource.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      {selectedResource.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    Select a resource to view its content
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Subscription Required
              </CardTitle>
              <CardDescription>
                This content requires a higher subscription tier to access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionPlans 
                onSuccess={() => {
                  setShowUpgradeModal(false);
                  if (lockedResourceId) {
                    handleResourceSelect(lockedResourceId);
                    setLockedResourceId(null);
                  }
                }}
              />
            </CardContent>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}