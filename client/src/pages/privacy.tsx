import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At FrequencyGuard, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
          </p>
          <p>
            This Privacy Policy has been designed to comply with the UK Data Protection Act 2018 and the EU General Data Protection Regulation (GDPR).
          </p>
          
          <h2>2. Data Controller</h2>
          <p>
            FrequencyGuard is the data controller responsible for your personal data. If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            Email: privacy@frequencyguard.co.uk<br />
            Address: 123 Protection Street, London, UK
          </p>
          
          <h2>3. Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <h3>3.1 Personal Information</h3>
          <ul>
            <li>Contact information (name, email address)</li>
            <li>Account information (username, password)</li>
            <li>Payment information (processed securely through our payment processors)</li>
            <li>Subscription details</li>
          </ul>
          
          <h3>3.2 Usage Information</h3>
          <ul>
            <li>Device information (device type, operating system)</li>
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Audio analysis data (frequency patterns detected)</li>
            <li>Location data (if enabled and with your consent)</li>
          </ul>
          
          <h2>4. How We Use Your Information</h2>
          <p>
            We use your information for the following purposes:
          </p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To process payments and manage subscriptions</li>
            <li>To detect and protect against audio-based harassment</li>
            <li>To improve and personalize our Service</li>
            <li>To communicate with you about our Service</li>
            <li>To comply with legal obligations</li>
          </ul>
          
          <h2>5. Legal Basis for Processing</h2>
          <p>
            We process your personal data on the following legal bases:
          </p>
          <ul>
            <li>Performance of a contract (when you use our Service)</li>
            <li>Your consent (for optional features like location tracking)</li>
            <li>Legitimate interests (to improve our Service and ensure security)</li>
            <li>Legal obligation (to comply with applicable laws)</li>
          </ul>
          
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          
          <h2>7. Data Sharing and Transfers</h2>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li>Service providers (payment processors, hosting providers)</li>
            <li>Law enforcement agencies (when required by law or to protect rights)</li>
            <li>Emergency services (when automatic reporting is enabled)</li>
          </ul>
          <p>
            All data is stored and processed within the UK and European Economic Area (EEA). If any data transfer outside the EEA becomes necessary, we will ensure appropriate safeguards are in place.
          </p>
          
          <h2>8. Your Data Protection Rights</h2>
          <p>
            Under the GDPR, you have the following rights:
          </p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Rights related to automated decision-making and profiling</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@frequencyguard.co.uk.
          </p>
          
          <h2>9. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookies through your browser settings.
          </p>
          
          <h2>10. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 16 years of age. We do not knowingly collect personal data from children under 16. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </p>
          
          <h2>11. Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
          
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>13. Complaints</h2>
          <p>
            If you have a complaint about our use of your personal data, please contact us first. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Last Updated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}