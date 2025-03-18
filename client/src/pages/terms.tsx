import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to FrequencyGuard ("we," "our," or "us"). These Terms and Conditions govern your use of our website, mobile application, and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms and Conditions.
          </p>
          
          <h2>2. Definitions</h2>
          <p>
            <strong>"Service"</strong> refers to the FrequencyGuard application, website, and all related services provided by us.<br />
            <strong>"User"</strong> refers to any individual who accesses or uses our Service.<br />
            <strong>"Subscription"</strong> refers to the paid access to premium features of our Service.
          </p>
          
          <h2>3. Use of Service</h2>
          <p>
            Our Service is designed to detect and protect against audio-based harassment, including sound cannons and voice-to-skull technologies. While we strive to provide accurate detection and protection, we cannot guarantee complete effectiveness in all situations.
          </p>
          
          <h2>4. Account Registration</h2>
          <p>
            To use certain features of our Service, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          
          <h2>5. Subscription and Payments</h2>
          <p>
            5.1 <strong>Subscription Tiers:</strong> We offer various subscription tiers with different features and pricing.<br />
            5.2 <strong>Trial Period:</strong> All subscription tiers include a 24-hour trial period.<br />
            5.3 <strong>Cooling-off Period:</strong> You have a 14-day cooling-off period from the date of subscription during which you can cancel your subscription and receive a full refund.<br />
            5.4 <strong>Payment Methods:</strong> We accept payments via PayPal, Apple Pay, Google Pay, and major credit cards (Visa, Mastercard, American Express, Maestro).<br />
            5.5 <strong>Currency:</strong> All prices are listed in British Pounds (£).
          </p>
          
          <h2>6. Cancellation and Refunds</h2>
          <p>
            6.1 You may cancel your subscription at any time through your account settings.<br />
            6.2 If you cancel within the 14-day cooling-off period, you will receive a full refund.<br />
            6.3 After the cooling-off period, cancellations will take effect at the end of your current billing cycle, and no refunds will be provided for the unused portion of your subscription.
          </p>
          
          <h2>7. User Conduct</h2>
          <p>
            You agree not to use our Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair our Service.
          </p>
          
          <h2>8. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our Service, including but not limited to text, graphics, logos, icons, and software, are owned by us or our licensors and are protected by UK and international copyright, trademark, and other intellectual property laws.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with your use of our Service.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. We will provide notice of any material changes by posting the new Terms and Conditions on our website and updating the "Last Updated" date.
          </p>
          
          <h2>11. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
          </p>
          
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:<br />
            Email: support@frequencyguard.co.uk<br />
            Address: 123 Protection Street, London, UK
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Last Updated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}