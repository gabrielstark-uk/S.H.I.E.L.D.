import { useAuth } from '@/hooks/use-auth';
import { SubscriptionPlans } from '@/components/subscription-plans';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Shield, CreditCard } from 'lucide-react';

export default function Subscription() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Shield className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-xl text-muted-foreground">
            Please log in to manage your subscription
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => setLocation('/login')}>
              Log In
            </Button>
            <Button variant="outline" onClick={() => setLocation('/register')}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <CreditCard className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-muted rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Current Plan</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                </div>
                <div className="text-muted-foreground">
                  {user.subscriptionTier === 'free' ? (
                    'Free plan with basic features'
                  ) : (
                    'Premium features activated'
                  )}
                </div>
              </div>
              {user.subscriptionTier !== 'free' && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Next billing date</div>
                  <div className="font-medium">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Available Plans</h2>
          <SubscriptionPlans />
        </div>

        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-6 max-w-3xl">
            <div>
              <h4 className="font-medium text-lg">Can I change my plan later?</h4>
              <p className="text-muted-foreground mt-1">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg">How do I cancel my subscription?</h4>
              <p className="text-muted-foreground mt-1">
                You can cancel your subscription from your account settings. Your plan will remain active until the end of the current billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg">Are there any refunds?</h4>
              <p className="text-muted-foreground mt-1">
                We offer a 14-day money-back guarantee for all paid plans. Contact our support team for assistance.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg">What payment methods do you accept?</h4>
              <p className="text-muted-foreground mt-1">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}