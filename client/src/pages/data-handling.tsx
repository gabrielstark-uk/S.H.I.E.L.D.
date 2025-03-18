import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, Database, FileText } from "lucide-react";

export default function DataHandling() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How We Handle Your Data</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="lead">
            At FrequencyGuard, we take the security and privacy of your data extremely seriously. This page explains in detail how we collect, process, store, and protect your information.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div>
              <h2 className="flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Data Collection
              </h2>
              <p>
                We collect several types of data to provide our service:
              </p>
              <h3>Account Data</h3>
              <ul>
                <li>Email address</li>
                <li>Name (optional)</li>
                <li>Securely hashed password</li>
                <li>Subscription information</li>
              </ul>
              
              <h3>Audio Analysis Data</h3>
              <ul>
                <li>Frequency patterns detected</li>
                <li>Timestamps of detections</li>
                <li>Countermeasures applied</li>
              </ul>
              
              <h3>Device Information</h3>
              <ul>
                <li>Device type and model</li>
                <li>Operating system</li>
                <li>Browser type (for web app)</li>
                <li>Microphone specifications</li>
              </ul>
              
              <h3>Location Data (Optional)</h3>
              <ul>
                <li>GPS coordinates (only when enabled)</li>
                <li>IP-based location (approximate)</li>
              </ul>
            </div>
            
            <div>
              <h2 className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Data Processing
              </h2>
              <p>
                Here's how we process your data:
              </p>
              
              <h3>Audio Processing</h3>
              <p>
                All audio processing happens locally on your device. Raw audio is never sent to our servers - only the analysis results and detection reports are transmitted when necessary.
              </p>
              
              <h3>Report Generation</h3>
              <p>
                When our system detects harmful frequencies, it generates a report containing:
              </p>
              <ul>
                <li>Frequency information</li>
                <li>Time and duration</li>
                <li>Severity assessment</li>
                <li>Location data (if enabled)</li>
              </ul>
              
              <h3>Automatic Reporting</h3>
              <p>
                If you enable automatic reporting to authorities, we will:
              </p>
              <ul>
                <li>Format the detection data into an official report</li>
                <li>Transmit it securely to the nearest police department</li>
                <li>Provide you with a copy and reference number</li>
              </ul>
              <p>
                This feature is opt-in only and can be disabled at any time.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div>
              <h2 className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Data Security
              </h2>
              <p>
                We implement robust security measures to protect your data:
              </p>
              
              <h3>Encryption</h3>
              <ul>
                <li>All data is encrypted in transit using TLS 1.3</li>
                <li>Sensitive data is encrypted at rest using AES-256</li>
                <li>Passwords are hashed using bcrypt with strong salt rounds</li>
              </ul>
              
              <h3>Access Controls</h3>
              <ul>
                <li>Strict role-based access controls for our staff</li>
                <li>Multi-factor authentication for administrative access</li>
                <li>Regular access reviews and audits</li>
              </ul>
              
              <h3>Infrastructure Security</h3>
              <ul>
                <li>All servers located in UK/EU data centers</li>
                <li>Regular security patching and updates</li>
                <li>Continuous monitoring for suspicious activities</li>
                <li>Regular penetration testing by independent security firms</li>
              </ul>
            </div>
            
            <div>
              <h2 className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Data Retention & Deletion
              </h2>
              <p>
                We retain your data only as long as necessary:
              </p>
              
              <h3>Account Data</h3>
              <p>
                Retained for the duration of your account. When you delete your account, all personal information is permanently removed within 30 days.
              </p>
              
              <h3>Detection Reports</h3>
              <p>
                Standard retention period is 90 days. Premium subscribers can choose longer retention periods for evidentiary purposes.
              </p>
              
              <h3>Usage Analytics</h3>
              <p>
                Anonymized usage data is retained for 12 months to help improve our service.
              </p>
              
              <h3>Your Right to Deletion</h3>
              <p>
                You can request deletion of your data at any time through:
              </p>
              <ul>
                <li>The "Delete My Data" option in account settings</li>
                <li>Contacting our Data Protection Officer at dpo@frequencyguard.co.uk</li>
              </ul>
              <p>
                We will process all deletion requests within 30 days and provide confirmation when completed.
              </p>
            </div>
          </div>
          
          <h2>GDPR Compliance</h2>
          <p>
            As a UK-based company, we fully comply with the General Data Protection Regulation (GDPR) and the UK Data Protection Act 2018. This means you have the right to:
          </p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Restrict processing</li>
            <li>Data portability</li>
            <li>Object to processing</li>
          </ul>
          <p>
            To exercise any of these rights, please contact our Data Protection Officer at dpo@frequencyguard.co.uk.
          </p>
          
          <h2>Third-Party Data Processors</h2>
          <p>
            We use the following third-party services to process specific types of data:
          </p>
          <ul>
            <li><strong>Payment Processing:</strong> PayPal, Stripe, Apple Pay, Google Pay</li>
            <li><strong>Cloud Infrastructure:</strong> Amazon Web Services (EU region)</li>
            <li><strong>Analytics:</strong> Google Analytics (anonymized)</li>
            <li><strong>Email Communications:</strong> Mailchimp</li>
          </ul>
          <p>
            All third-party processors are GDPR-compliant and subject to strict data processing agreements.
          </p>
          
          <h2>Data Protection Impact Assessment</h2>
          <p>
            We conduct regular Data Protection Impact Assessments (DPIAs) for all features that involve processing sensitive data. The results of these assessments guide our development practices and security measures.
          </p>
          
          <h2>Questions About Your Data</h2>
          <p>
            If you have any questions about how we handle your data, please contact:
          </p>
          <p>
            Data Protection Officer<br />
            Email: dpo@frequencyguard.co.uk<br />
            Phone: +44 (0)20 1234 5679<br />
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