import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionTier {
  name: string;
  price: number;
  features: {
    maxReports: number;
    advancedDetection: boolean;
    aiChatAccess: boolean;
    educationalAccess: string;
    realTimeAlerts: boolean;
    supportLevel: string;
  };
}

interface SubscriptionPlansProps {
  onSuccess?: () => void;
  className?: string;
}

export function SubscriptionPlans({ onSuccess, className = '' }: SubscriptionPlansProps) {
  const { user, token, upgradeSubscription, error: authError, isLoading: authLoading } = useAuth();
  const [subscriptionTiers, setSubscriptionTiers] = useState<Record<string, SubscriptionTier> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch subscription tiers
  useEffect(() => {
    fetch('/api/subscriptions')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        return response.json();
      })
      .then(data => {
        setSubscriptionTiers(data.tiers);
      })
      .catch(err => {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Show auth errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleUpgrade = async (tier: string) => {
    if (!user || !token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription.",
        variant: "destructive"
      });
      return;
    }

    setProcessingTier(tier);
    setError(null);

    try {
      await upgradeSubscription(tier as 'free' | 'basic' | 'premium' | 'enterprise');
      
      toast({
        title: "Subscription Updated",
        description: `Your subscription has been upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)}.`,
        variant: "default"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error upgrading subscription:', err);
    } finally {
      setProcessingTier(null);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">Error Loading Subscription Plans</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!subscriptionTiers) {
    return null;
  }

  const formatFeature = (key: string, value: any): string => {
    switch (key) {
      case 'maxReports':
        return value === -1 ? 'Unlimited reports' : `${value} reports per month`;
      case 'advancedDetection':
        return value ? 'Advanced detection algorithms' : 'Basic detection';
      case 'aiChatAccess':
        return value ? 'AI assistant access' : 'No AI assistant';
      case 'educationalAccess':
        return `${value.charAt(0).toUpperCase() + value.slice(1)} educational content`;
      case 'realTimeAlerts':
        return value ? 'Real-time alerts' : 'Standard alerts';
      case 'supportLevel':
        return `${value.charAt(0).toUpperCase() + value.slice(1)} support`;
      default:
        return String(value);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Object.entries(subscriptionTiers).map(([tierKey, tier]) => {
        const isCurrentTier = user?.subscriptionTier === tierKey;
        
        return (
          <Card key={tierKey} className={`flex flex-col ${isCurrentTier ? 'border-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{tier.name}</CardTitle>
                {isCurrentTier && <Badge variant="outline">Current Plan</Badge>}
              </div>
              <CardDescription>
                {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}/month`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {Object.entries(tier.features).map(([featureKey, value]) => (
                  <li key={featureKey} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{formatFeature(featureKey, value)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrentTier ? "outline" : "default"}
                disabled={isCurrentTier || processingTier === tierKey || authLoading}
                onClick={() => handleUpgrade(tierKey)}
              >
                {processingTier === tierKey ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : isCurrentTier ? (
                  'Current Plan'
                ) : (
                  `Upgrade to ${tier.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}