import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Lock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PinVerificationModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onMaxAttemptsReached: () => void;
  attempts: number;
  maxAttempts: number;
  onAttemptUpdate: (attempts: number) => void;
}

export function PinVerificationModal({
  isOpen,
  onSuccess,
  onMaxAttemptsReached,
  attempts,
  maxAttempts,
  onAttemptUpdate
}: PinVerificationModalProps) {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const CORRECT_PIN = '8163';

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      // Focus first input when modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newPin = pin.split('');
    newPin[index] = value;
    const updatedPin = newPin.join('');
    setPin(updatedPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (pin === CORRECT_PIN) {
      toast.success('PIN verified successfully!');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      onAttemptUpdate(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        toast.error('Maximum attempts reached. Please contact support.');
        onMaxAttemptsReached();
      } else {
        setError(`Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`);
        toast.error(`Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`);
      }
      setPin('');
      // Focus first input after error
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle>PIN Verification Required</CardTitle>
          <CardDescription>
            Enter the 4-digit PIN to access the registration form
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-center block">Enter PIN</Label>
              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3].map((index) => (
                  <Input
                    key={index}
                    ref={(el:any) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={pin[index] || ''}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    disabled={isSubmitting}
                  />
                ))}
              </div>
              
              {error && (
                <div className="flex items-center justify-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-600">
                Attempts: {attempts}/{maxAttempts}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || pin.length !== 4}
            >
              {isSubmitting ? 'Verifying...' : 'Verify PIN'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
