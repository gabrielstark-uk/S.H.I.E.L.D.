import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AIChatbot } from '@/components/ai-chatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { MessageSquare, Shield, Radio, BookOpen, AlertTriangle, Info } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('general');

  // Suggested questions by category
  const suggestedQuestions = {
    general: [
      "What is FrequencyGuard and how does it work?",
      "How can I improve my detection accuracy?",
      "What should I do if I detect a sound cannon?",
      "Can you explain the different subscription tiers?",
      "How do I interpret the frequency data visualization?"
    ],
    technology: [
      "What is a sound cannon and how does it work?",
      "Can you explain what V2K technology is?",
      "How do ultrasonic frequencies affect humans?",
      "What's the difference between infrasound and ultrasound?",
      "How does FrequencyGuard detect harmful frequencies?"
    ],
    protection: [
      "What are the best countermeasures against sound cannons?",
      "How can I protect myself from audio harassment?",
      "What materials can block ultrasonic frequencies?",
      "Are there legal ways to respond to audio harassment?",
      "How effective are the built-in countermeasures?"
    ],
    resources: [
      "What organizations can help with audio harassment?",
      "Are there support groups for people experiencing harassment?",
      "What should I include in a police report about audio harassment?",
      "Are there medical professionals who specialize in this area?",
      "What documentation should I keep if I experience harassment?"
    ]
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <MessageSquare className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-xl text-muted-foreground">
            Please log in to chat with our AI assistant
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

  // Check if user's subscription allows AI chat
  const canAccessChat = user.subscriptionTier !== 'free';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Get expert help and answers to your questions
          </p>
        </div>

        {!canAccessChat ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Subscription Required
              </CardTitle>
              <CardDescription>
                AI chat assistance is available with Basic subscription and above.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  Upgrade your subscription to access our AI assistant that can help you with:
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    Understanding and responding to audio harassment
                  </li>
                  <li className="flex items-start gap-2">
                    <Radio className="h-4 w-4 mt-0.5 text-primary" />
                    Technical explanations of sound technologies
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 mt-0.5 text-primary" />
                    Guidance on protective measures and resources
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 text-primary" />
                    Personalized advice for your specific situation
                  </li>
                </ul>
              </div>
              <Button onClick={() => setLocation('/subscription')} className="w-full">
                Upgrade Subscription
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChatbot 
                title="FrequencyGuard Assistant" 
                initialMessage="Hello! I'm your FrequencyGuard assistant. How can I help you today? You can ask me about audio technologies, harassment protection, or how to use the app's features."
                className="h-[600px]"
              />
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Questions</CardTitle>
                  <CardDescription>
                    Click on any question to ask the AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="technology">Technology</TabsTrigger>
                      <TabsTrigger value="protection">Protection</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(suggestedQuestions).map(([category, questions]) => (
                      <TabsContent key={category} value={category} className="space-y-2">
                        {questions.map((question, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => {
                              // This would trigger the chatbot to ask this question
                              // In a real implementation, you'd use a ref or context to communicate with the chatbot
                              console.log(`User clicked suggested question: ${question}`);
                              // For now, we'll just alert
                              alert(`You selected: "${question}"\n\nIn a real implementation, this would be sent to the chatbot.`);
                            }}
                          >
                            {question}
                          </Button>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>
                    Our AI assistant is trained on specialized knowledge about audio technologies, 
                    harassment protection, and countermeasures.
                  </p>
                  <p>
                    All conversations are private and encrypted. Your chat history is saved 
                    so you can refer back to previous advice.
                  </p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="font-medium">Important Note:</p>
                    <p className="mt-1">
                      While our AI provides helpful information, please contact emergency services 
                      if you're in immediate danger.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}