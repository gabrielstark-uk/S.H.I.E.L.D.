import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, AlertCircle, Lock, ExternalLink, Phone, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Resource {
  id: number;
  title: string;
  content: string;
  category: string;
  accessLevel: 'free' | 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

interface CharityInfo {
  name: string;
  description: string;
  website: string;
  phone?: string;
  category: string;
}

const charities: CharityInfo[] = [
  {
    name: "Samaritans",
    description: "Provides emotional support to anyone in emotional distress or struggling to cope.",
    website: "https://www.samaritans.org/",
    phone: "116 123",
    category: "mental-health"
  },
  {
    name: "Mind",
    description: "Provides advice and support to empower anyone experiencing a mental health problem.",
    website: "https://www.mind.org.uk/",
    phone: "0300 123 3393",
    category: "mental-health"
  },
  {
    name: "Victim Support",
    description: "Independent charity for people affected by crime and traumatic incidents in England and Wales.",
    website: "https://www.victimsupport.org.uk/",
    phone: "0808 16 89 111",
    category: "support"
  },
  {
    name: "National Stalking Helpline",
    description: "Provides information and guidance to anybody who is currently or has previously been affected by harassment or stalking.",
    website: "https://www.suzylamplugh.org/",
    phone: "0808 802 0300",
    category: "harassment"
  },
  {
    name: "Refuge",
    description: "Supports women and children experiencing domestic violence with a range of services.",
    website: "https://www.refuge.org.uk/",
    phone: "0808 2000 247",
    category: "harassment"
  },
  {
    name: "Protection Against Stalking",
    description: "Works to improve responses to stalking across all sectors through awareness raising and training.",
    website: "https://www.protectionagainststalking.org/",
    category: "harassment"
  },
  {
    name: "Paladin National Stalking Advocacy Service",
    description: "Provides trauma-informed support, advice and advocacy to high risk victims of stalking.",
    website: "https://paladinservice.co.uk/",
    phone: "020 3866 4107",
    category: "harassment"
  },
  {
    name: "Citizens Advice",
    description: "Provides free, confidential information and advice to assist people with legal, debt, consumer, housing and other problems.",
    website: "https://www.citizensadvice.org.uk/",
    phone: "0800 144 8848",
    category: "legal"
  },
  {
    name: "Rights of Women",
    description: "Provides women with free, confidential legal advice by specialist women solicitors and barristers.",
    website: "https://rightsofwomen.org.uk/",
    category: "legal"
  },
  {
    name: "Action Fraud",
    description: "The UK's national reporting centre for fraud and cybercrime.",
    website: "https://www.actionfraud.police.uk/",
    phone: "0300 123 2040",
    category: "legal"
  }
];

export function EducationResources() {
  const { user, token } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [filteredCharities, setFilteredCharities] = useState<CharityInfo[]>(charities);

  useEffect(() => {
    fetchResources();
  }, [token]);

  useEffect(() => {
    if (activeTab === 'charities') {
      if (searchQuery) {
        setFilteredCharities(
          charities.filter(charity => 
            charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            charity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            charity.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredCharities(charities);
      }
    } else {
      if (searchQuery) {
        setFilteredResources(
          resources.filter(resource => 
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredResources(resources);
      }
    }
  }, [searchQuery, resources, activeTab]);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/education', {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      setResources(data);
      setFilteredResources(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const viewResource = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/education/${id}`, {
        headers
      });
      
      if (response.status === 403) {
        const data = await response.json();
        throw new Error(`Subscription required: ${data.requiredTier}`);
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch resource');
      }
      
      const resource = await response.json();
      setSelectedResource(resource);
      setIsResourceDialogOpen(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      case 'basic':
        return <Badge variant="secondary">Basic</Badge>;
      case 'premium':
        return <Badge variant="default">Premium</Badge>;
      case 'enterprise':
        return <Badge variant="destructive">Enterprise</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'technology':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50 border-blue-200">Technology</Badge>;
      case 'protection':
        return <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50 border-green-200">Protection</Badge>;
      case 'science':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 hover:bg-purple-50 border-purple-200">Science</Badge>;
      case 'legal':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50 border-amber-200">Legal</Badge>;
      case 'mental-health':
        return <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-50 border-red-200">Mental Health</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  if (loading && resources.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="protection">Protection</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="charities">Charities & Support</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <TabsContent value="all" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {getAccessLevelBadge(resource.accessLevel)}
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                  {getCategoryBadge(resource.category)}
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(resource.updatedAt).toLocaleDateString('en-GB')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3">
                  {resource.content.substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => viewResource(resource.id)}
                >
                  {resource.accessLevel !== 'free' && !user && (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No resources found matching your search.</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="technology" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources
            .filter(resource => resource.category === 'technology')
            .map((resource) => (
              <Card key={resource.id} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    {getAccessLevelBadge(resource.accessLevel)}
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    {getCategoryBadge(resource.category)}
                    <span className="text-xs text-muted-foreground">
                      Updated: {new Date(resource.updatedAt).toLocaleDateString('en-GB')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm line-clamp-3">
                    {resource.content.substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => viewResource(resource.id)}
                  >
                    {resource.accessLevel !== 'free' && !user && (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
          {filteredResources.filter(resource => resource.category === 'technology').length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No technology resources found matching your search.</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="protection" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources
            .filter(resource => resource.category === 'protection')
            .map((resource) => (
              <Card key={resource.id} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    {getAccessLevelBadge(resource.accessLevel)}
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    {getCategoryBadge(resource.category)}
                    <span className="text-xs text-muted-foreground">
                      Updated: {new Date(resource.updatedAt).toLocaleDateString('en-GB')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm line-clamp-3">
                    {resource.content.substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => viewResource(resource.id)}
                  >
                    {resource.accessLevel !== 'free' && !user && (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
          {filteredResources.filter(resource => resource.category === 'protection').length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No protection resources found matching your search.</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="science" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources
            .filter(resource => resource.category === 'science')
            .map((resource) => (
              <Card key={resource.id} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    {getAccessLevelBadge(resource.accessLevel)}
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    {getCategoryBadge(resource.category)}
                    <span className="text-xs text-muted-foreground">
                      Updated: {new Date(resource.updatedAt).toLocaleDateString('en-GB')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm line-clamp-3">
                    {resource.content.substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => viewResource(resource.id)}
                  >
                    {resource.accessLevel !== 'free' && !user && (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
          {filteredResources.filter(resource => resource.category === 'science').length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No science resources found matching your search.</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="charities" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((charity, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-2" />
                    {charity.name}
                  </CardTitle>
                  {getCategoryBadge(charity.category)}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">
                  {charity.description}
                </p>
                {charity.phone && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    {charity.phone}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(charity.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredCharities.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No charities found matching your search.</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      {/* Resource Dialog */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedResource.title}</DialogTitle>
                  {getAccessLevelBadge(selectedResource.accessLevel)}
                </div>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  {getCategoryBadge(selectedResource.category)}
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(selectedResource.updatedAt).toLocaleDateString('en-GB')}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 prose max-w-none">
                {selectedResource.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsResourceDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}