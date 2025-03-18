import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState('');
  const { register, isLoading, error } = useAuth();
  const [_, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!password) {
      setFormError('Password is required');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await register({
        email,
        password,
        confirmPassword,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      
      // The auth hook will automatically log the user in after registration
      setLocation('/');
    } catch (err) {
      // Error is handled by the auth hook
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { text: 'Very Weak', color: 'bg-destructive' },
      { text: 'Weak', color: 'bg-destructive/80' },
      { text: 'Fair', color: 'bg-amber-500' },
      { text: 'Good', color: 'bg-amber-400' },
      { text: 'Strong', color: 'bg-green-500' },
      { text: 'Very Strong', color: 'bg-green-600' },
    ];
    
    return { 
      strength, 
      text: strengthMap[strength].text, 
      color: strengthMap[strength].color 
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Sign up to access all features of FrequencyGuard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || formError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {formError || error}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Password strength: {passwordStrength.text}</span>
                    <span>{passwordStrength.strength}/5</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color}`} 
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      {password.length >= 8 ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-1">
                      {/[A-Z]/.test(password) ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      Contains uppercase letter
                    </li>
                    <li className="flex items-center gap-1">
                      {/[0-9]/.test(password) ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      Contains number
                    </li>
                    <li className="flex items-center gap-1">
                      {/[^A-Za-z0-9]/.test(password) ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      Contains special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              {password && confirmPassword && (
                <div className="flex items-center gap-1 text-xs mt-1">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setLocation('/login');
              }}
            >
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}