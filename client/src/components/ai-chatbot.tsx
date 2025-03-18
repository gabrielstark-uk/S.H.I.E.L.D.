import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Info, AlertTriangle, Bot } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  initialMessage?: string;
  title?: string;
  className?: string;
}

export function AIChatbot({ initialMessage = "Hello! I'm your FrequencyGuard assistant. How can I help you today?", title = "AI Assistant", className = "" }: ChatbotProps) {
  const { user, token, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubscriptionRequired, setIsSubscriptionRequired] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with system message and session ID
  useEffect(() => {
    // Generate a unique session ID
    setSessionId(uuidv4());
    
    // Add initial message
    setMessages([
      {
        id: uuidv4(),
        content: initialMessage,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, [initialMessage]);

  // Load chat history if user is logged in
  useEffect(() => {
    if (user && token && sessionId) {
      setIsLoading(true);
      
      fetch(`/api/chat/history/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.status === 403) {
            setIsSubscriptionRequired(true);
            throw new Error('Subscription required');
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            const formattedMessages = data.map((msg: any) => ({
              id: uuidv4(),
              content: msg.message,
              isUser: msg.isUserMessage,
              timestamp: new Date(msg.timestamp)
            }));
            
            setMessages(formattedMessages);
          }
        })
        .catch(err => {
          if (err.message !== 'Subscription required') {
            setError('Failed to load chat history');
            console.error('Error loading chat history:', err);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, token, sessionId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: uuidv4(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          sessionId
        })
      });
      
      if (response.status === 403) {
        setIsSubscriptionRequired(true);
        throw new Error('Subscription required');
      }
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = {
        id: uuidv4(),
        content: data.message,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      if (err.message !== 'Subscription required') {
        setError('Failed to get response. Please try again.');
        console.error('Chat error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isSubscriptionRequired) {
    return (
      <Card className={`flex flex-col ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot size={20} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <AlertTriangle size={48} className="mx-auto text-amber-500" />
            <h3 className="text-lg font-semibold">Subscription Required</h3>
            <p className="text-muted-foreground">
              AI chat assistance is available with Basic subscription and above.
            </p>
            <Button onClick={() => window.location.href = '/subscription'}>
              Upgrade Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[350px] p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  {!message.isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/ai-assistant.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage || ''} alt="User" />
                      <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {error && (
              <div className="flex justify-center">
                <div className="bg-destructive/10 text-destructive rounded-lg p-2 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3">
        {!authLoading && !user ? (
          <div className="w-full text-center p-2">
            <p className="text-sm text-muted-foreground mb-2">
              <Info size={16} className="inline mr-1" />
              Please log in to use the AI assistant
            </p>
            <Button size="sm" onClick={() => window.location.href = '/login'}>
              Log In
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 min-h-[40px] max-h-[120px]"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}