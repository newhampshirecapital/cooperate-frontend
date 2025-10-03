import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { CreditCard, ArrowRight, X } from 'lucide-react';
import bannerOne from '../assets/banner1.png';

interface VirtualAccountModalProps {
  user: any;
  virtualAccount: any;
  onClose: () => void;
}

const VirtualAccountModal: React.FC<VirtualAccountModalProps> = ({ 
  virtualAccount, 
  onClose 
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  console.log('virtualAccount in the modal', virtualAccount);

  const handleCreateVirtualAccount = () => {
    // Navigate to virtual account creation page
    navigate('/create-virtual-account');
  };

  useEffect(() => {
    // Trigger the animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        className={`
          transform transition-all duration-700 ease-out
          ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
        `}
        style={{
          animation: isVisible ? 'float 3s ease-in-out infinite' : ''
        }}
      >
        <Card className="w-full max-w-4xl  shadow-2xl border-0 overflow-hidden">
          {/* Header with close button */}
          <CardHeader className="relative pb-0 pt-6 pr-6">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 mt-5 right-4 w-8 h-8 p-0 text-gray-400 hover:text-gray-600 z-10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          {/* Two-column layout */}
          <div className="grid grid-cols-1  lg:grid-cols-2 gap-0">
            {/* Left side - Image */}
            <div className="relative bg-gradient-to-br  from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-12 h-12 text-white" />
                </div>
                <img 
                  src={bannerOne} 
                  alt="Virtual Account Setup"
                  className="hidden lg:block w-full max-w-sm mx-auto rounded-2xl shadow-lg opacity-20"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-8 w-6 h-6 bg-white/15 rounded-full animate-pulse delay-500"></div>
            </div>
            
            {/* Right side - Content */}
            <CardContent className="p-8 lg:p-12 space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Set Up Your Virtual Account
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Create your virtual bank account to receive payments, track your balance, 
                  and manage your financial transactions seamlessly with our secure platform.
                </p>
              </div>

              {/* Benefits Section */}
              <div className="space-y-4">
                <h3 className="text-sm md:text-xl font-semibold text-gray-900">What you'll get:</h3>
                <div className="space-y-2 md:space-y-3">
                  {[
                    { text: 'Secure virtual bank account with 256-bit encryption', icon: '🛡️' },
                    { text: 'Real-time balance tracking and notifications', icon: '📊' },
                    { text: 'Instant payment processing and transfers', icon: '⚡' },
                    { text: 'Complete transaction history and analytics', icon: '📈' }
                  ].map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'slideInLeft 0.5s ease-out forwards'
                      }}
                    >
                      <span className="text-xl mt-0.5">{benefit.icon}</span>
                      <span className="text-gray-700 font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 md:space-y-4 pt-1 md:pt-6">
                <Button 
                  className="w-full bg-gradient-To-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 py-6 text-lg font-semibold rounded-xl"
                  onClick={ handleCreateVirtualAccount}
                >
                  Create Virtual Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full py-4 text-gray-600 hover:bg-gray-50 transition-colors rounded-xl border-gray-300"
                  onClick={onClose}
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      <style >{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VirtualAccountModal;
