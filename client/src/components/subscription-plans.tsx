import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// UK-specific subscription plans with prices in GBP
const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    description: 'Basic protection for occasional use',
    features: [
      'Basic frequency detection',
      'Manual countermeasures',
      'Limited reports history (5)',
      'Community support',
      'Basic educational resources'
    ],
    limitations: [
      'No AI chat assistance',
      'No real-time alerts',
      'No automatic reporting'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '£7.99',
    description: 'Enhanced protection for regular users',
    features: [
      'Advanced frequency detection',
      'Automated countermeasures',
      'Extended reports history (20)',
      'AI chat assistance',
      'Standard educational resources',
      'Email support'
    ],
    limitations: [
      'No real-time alerts',
      'Limited automatic reporting'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '£15.99',
    description: 'Comprehensive protection for high-risk individuals',
    features: [
      'Premium frequency detection',
      'Advanced automated countermeasures',
      'Extended reports history (100)',
      'Unlimited AI chat assistance',
      'Premium educational resources',
      'Real-time alerts',
      'Automatic reporting to authorities',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '£39.99',
    description: 'Maximum protection for organizations and high-profile individuals',
    features: [
      'Enterprise-grade frequency detection',
      'Custom countermeasure profiles',
      'Unlimited reports history',
      'Unlimited AI chat assistance',
      'All educational resources',
      'Advanced real-time alerts',
      'Automatic reporting with evidence collection',
      'Dedicated support representative',
      'Multi-device protection'
    ]
  }
];

interface SubscriptionPlansProps {
  onSuccess?: () => void;
  className?: string;
}

export function SubscriptionPlans({ onSuccess, className = '' }: SubscriptionPlansProps) {
  const { user, upgradeSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    if (planId === user?.subscriptionTier) {
      return; // Don't allow selecting current plan
    }
    setSelectedPlan(planId);
    setIsPaymentDialogOpen(true);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    setIsUpgrading(true);
    setError(null);

    try {
      await upgradeSubscription(selectedPlan as any);
      setIsPaymentDialogOpen(false);
      setIsSuccessDialogOpen(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade subscription');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
                {plan.popular && (
                  <Badge className="bg-primary">Popular</Badge>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations && (
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">Limitations</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-start text-muted-foreground">
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0">
              <div className="text-xs text-muted-foreground w-full">
                <div className="flex justify-between mb-1">
                  <span>24-hour free trial</span>
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>14-day cooling-off period</span>
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              </div>

              <Button
                className="w-full mt-2"
                variant={plan.id === user?.subscriptionTier ? 'outline' : 'default'}
                disabled={plan.id === user?.subscriptionTier}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.id === user?.subscriptionTier ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && `You're subscribing to the ${plans.find(p => p.id === selectedPlan)?.name} plan.`}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="py-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Important Information</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Your subscription includes a 24-hour free trial period</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>You have a 14-day cooling-off period during which you can cancel for a full refund</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Your subscription will automatically renew monthly unless cancelled</span>
                </li>
              </ul>
            </div>

            <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="paypal">PayPal</TabsTrigger>
                <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                <TabsTrigger value="google">Google Pay</TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="J. Smith" />
                </div>
              </TabsContent>

              <TabsContent value="paypal" className="mt-4">
                <div className="text-center py-8">
                  <p className="mb-4">Click the button below to pay with PayPal</p>
                  <Button className="bg-[#0070ba] hover:bg-[#005ea6]">
                    Pay with PayPal
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="apple" className="mt-4">
                <div className="text-center py-8">
                  <p className="mb-4">Click the button below to pay with Apple Pay</p>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Pay with Apple Pay
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="google" className="mt-4">
                <div className="text-center py-8">
                  <p className="mb-4">Click the button below to pay with Google Pay</p>
                  <Button className="bg-white text-black border hover:bg-gray-100">
                    Pay with Google Pay
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpgrade} disabled={isUpgrading}>
              {isUpgrading ? 'Processing...' : 'Subscribe Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Successful!</DialogTitle>
            <DialogDescription>
              Thank you for subscribing to FrequencyGuard.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Subscription activated</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Your 24-hour free trial has started</li>
                      <li>You won't be charged until the trial ends</li>
                      <li>You can cancel anytime within the next 14 days for a full refund</li>
                      <li>All premium features are now available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}