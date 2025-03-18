import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Award, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">About FrequencyGuard</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Our Mission
              </h2>
              <p>
                FrequencyGuard was founded with a clear mission: to protect individuals from audio-based harassment and provide peace of mind in an increasingly complex technological world. We believe everyone deserves to feel safe from unwanted sonic intrusions, whether they come from sound cannons, voice-to-skull technologies, or other audio harassment methods.
              </p>
              <p>
                Based in the United Kingdom, we develop cutting-edge technology that detects, analyzes, and counteracts harmful audio frequencies, giving our users the tools they need to protect themselves and document incidents for authorities when necessary.
              </p>
            </div>
            
            <div>
              <h2 className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Our Team
              </h2>
              <p>
                Our team consists of experts in audio engineering, cybersecurity, and victim advocacy. With decades of combined experience, our specialists work tirelessly to stay ahead of emerging audio harassment technologies and develop effective countermeasures.
              </p>
              <p>
                Led by our founder, Dr. Elizabeth Harrington, a former audio forensics specialist with the Metropolitan Police, FrequencyGuard combines technical expertise with a deep understanding of the real-world impacts of audio harassment.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Our Approach
              </h2>
              <p>
                FrequencyGuard takes a comprehensive approach to audio protection:
              </p>
              <ul>
                <li><strong>Detection:</strong> Our advanced algorithms identify harmful audio patterns in real-time</li>
                <li><strong>Protection:</strong> We deploy countermeasures to neutralize harmful frequencies</li>
                <li><strong>Documentation:</strong> We create detailed reports for authorities when incidents occur</li>
                <li><strong>Education:</strong> We provide resources to help users understand and address audio harassment</li>
              </ul>
              <p>
                All our technology is developed with privacy and security at its core, ensuring your data remains protected while we keep you safe.
              </p>
            </div>
            
            <div>
              <h2 className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Our Commitment
              </h2>
              <p>
                We are committed to:
              </p>
              <ul>
                <li>Continuously improving our detection and protection capabilities</li>
                <li>Maintaining the highest standards of data privacy and security</li>
                <li>Supporting victims of audio harassment through partnerships with advocacy groups</li>
                <li>Contributing to research and awareness about audio harassment technologies</li>
                <li>Making our technology accessible to those who need it most</li>
              </ul>
              <p>
                A portion of all subscription fees is donated to charities supporting victims of harassment and technology abuse.
              </p>
            </div>
          </div>
          
          <h2>Our Partners</h2>
          <p>
            FrequencyGuard proudly partners with:
          </p>
          <ul>
            <li>The Samaritans</li>
            <li>Victim Support UK</li>
            <li>National Stalking Helpline</li>
            <li>Refuge</li>
            <li>Mind</li>
          </ul>
          <p>
            These partnerships allow us to provide comprehensive support to users who may be experiencing harassment beyond audio technologies.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            We welcome your questions, feedback, and inquiries:
          </p>
          <p>
            Email: contact@frequencyguard.co.uk<br />
            Phone: +44 (0)20 1234 5678<br />
            Address: 123 Protection Street, London, UK
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            FrequencyGuard Ltd. is registered in England and Wales (Company No. 12345678)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}