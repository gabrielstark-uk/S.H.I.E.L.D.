import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, BookOpen } from "lucide-react";

export default function Education() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">Educational Resources</h1>
      
      <Tabs defaultValue="spyware">
        <TabsList>
          <TabsTrigger value="spyware">Types of Spyware</TabsTrigger>
          <TabsTrigger value="detection">Detection Methods</TabsTrigger>
          <TabsTrigger value="prevention">Prevention</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spyware" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Common Types of Spyware
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Audio Recording Devices</h3>
              <p>Small microphones that can be hidden in everyday objects</p>
              
              <h3 className="text-lg font-semibold">Ultrasonic Beacons</h3>
              <p>High-frequency sounds used for tracking and data transmission</p>
              
              <h3 className="text-lg font-semibold">Audio Surveillance Software</h3>
              <p>Programs that can remotely activate microphones</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detection" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                How to Detect Spyware
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Frequency Analysis</h3>
              <p>Use spectrum analyzers to detect unusual frequencies</p>
              
              <h3 className="text-lg font-semibold">Physical Inspection</h3>
              <p>Look for unfamiliar devices or modifications</p>
              
              <h3 className="text-lg font-semibold">Software Scanning</h3>
              <p>Use security tools to detect malicious programs</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prevention" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Prevention Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Physical Security</h3>
              <p>Control access to sensitive areas and regularly inspect for devices</p>
              
              <h3 className="text-lg font-semibold">Digital Security</h3>
              <p>Keep software updated and use security tools</p>
              
              <h3 className="text-lg font-semibold">Behavioral Practices</h3>
              <p>Be aware of surroundings and follow security protocols</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
