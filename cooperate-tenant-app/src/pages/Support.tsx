import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  
  MapPin, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Leaf,
  DollarSign,
  Shield,
  Users,
  ArrowRight,
  
  FileText,
  Video,
  BookOpen
} from 'lucide-react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const supportCategories = [
    {
      icon: Zap,
      title: 'Power Outages',
      description: 'Report outages and get restoration updates',
      color: 'from-red-500 to-orange-500',
      urgent: true
    },
    {
      icon: DollarSign,
      title: 'Billing & Payments',
      description: 'Questions about your bill, payment options, and account',
      color: 'from-green-500 to-emerald-500',
      urgent: false
    },
    {
      icon: Shield,
      title: 'Account Services',
      description: 'Account management, meter readings, and service changes',
      color: 'from-blue-500 to-cyan-500',
      urgent: false
    },
    {
      icon: Leaf,
      title: 'Energy Efficiency',
      description: 'Programs, rebates, and energy-saving tips',
      color: 'from-green-600 to-teal-600',
      urgent: false
    },
    {
      icon: Users,
      title: 'Membership',
      description: 'Cooperative membership, governance, and benefits',
      color: 'from-purple-500 to-violet-500',
      urgent: false
    },
    {
      icon: HelpCircle,
      title: 'General Support',
      description: 'Other questions and general assistance',
      color: 'from-gray-500 to-slate-500',
      urgent: false
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: '24/7 Emergency Line',
      description: 'For power outages and electrical emergencies',
      contact: '1-800-ENERGY-1',
      hours: '24/7',
      urgent: true,
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Phone,
      title: 'Customer Service',
      description: 'General questions and account assistance',
      contact: '1-800-CUSTOMER',
      hours: '8AM-6PM, Mon-Fri',
      urgent: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      contact: 'support@energycooperative.com',
      hours: 'Response within 24 hours',
      urgent: false,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team online',
      contact: 'Available on website',
      hours: '8AM-6PM, Mon-Fri',
      urgent: false,
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const officeLocations = [
    {
      name: 'Main Office',
      address: '123 Energy Street, Green City, GC 12345',
      phone: '(555) 123-4567',
      hours: '8AM-5PM, Mon-Fri',
      services: ['Customer Service', 'Account Management', 'Payment Center']
    },
    {
      name: 'North Branch',
      address: '456 Renewable Ave, North City, NC 67890',
      phone: '(555) 234-5678',
      hours: '9AM-4PM, Mon-Fri',
      services: ['Customer Service', 'Payment Center']
    },
    {
      name: 'South Branch',
      address: '789 Solar Blvd, South City, SC 13579',
      phone: '(555) 345-6789',
      hours: '9AM-4PM, Mon-Fri',
      services: ['Customer Service', 'Account Management']
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: 'User Guides',
      description: 'Step-by-step guides for common tasks',
      items: ['Online Account Setup', 'Reading Your Bill', 'Payment Options', 'Energy Efficiency Tips']
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch helpful videos',
      items: ['Smart Meter Overview', 'Energy Saving Tips', 'Account Management', 'Safety Guidelines']
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Detailed technical documentation',
      items: ['Service Terms', 'Rate Schedules', 'Safety Manual', 'Member Handbook']
    }
  ];

  const emergencySteps = [
    {
      step: 1,
      title: 'Check Your Breakers',
      description: 'Look for tripped circuit breakers in your electrical panel'
    },
    {
      step: 2,
      title: 'Check Neighbors',
      description: 'See if your neighbors are also experiencing an outage'
    },
    {
      step: 3,
      title: 'Report the Outage',
      description: 'Call our 24/7 emergency line or use our online outage reporting'
    },
    {
      step: 4,
      title: 'Stay Safe',
      description: 'Stay away from downed power lines and report them immediately'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Support <span className="text-yellow-300">Center</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              We're here to help! Get the support you need with our comprehensive 
              resources, multiple contact options, and expert assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                <Phone className="w-5 h-5 mr-2" />
                Emergency: 1-800-ENERGY-1
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Emergency Alert */}
        <Card className="mb-12 border-0 shadow-lg bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Power Outage or Electrical Emergency?</h3>
                <p className="text-red-100 mb-4">
                  Call our 24/7 emergency line immediately: <strong>1-800-ENERGY-1</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {emergencySteps.map((step) => (
                    <Badge key={step.step} variant="secondary" className="bg-white/20 text-white">
                      {step.step}. {step.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select a category to find the right support for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    selectedCategory === category.title ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.title)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                          {category.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="font-semibold text-blue-600">{method.contact}</p>
                      <p className="text-sm text-gray-500">{method.hours}</p>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={method.urgent ? "default" : "outline"}
                      size="sm"
                    >
                      {method.urgent ? 'Call Now' : 'Contact'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Our Offices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Come see us in person at one of our convenient locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{office.name}</h3>
                      <p className="text-gray-600 mb-3">{office.address}</p>
                      <p className="text-blue-600 font-medium mb-3">{office.phone}</p>
                      <p className="text-sm text-gray-500 mb-4">{office.hours}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Services Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {office.services.map((service, serviceIndex) => (
                        <Badge key={serviceIndex} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    Get Directions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Self-Service Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers and learn more with our comprehensive resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600">{resource.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {resource.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full mt-6" variant="outline">
                      Browse Resources
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Support Form */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Send Us a Message</CardTitle>
              <CardDescription className="text-center">
                Can't find what you're looking for? Send us a detailed message and we'll get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <Input type="email" placeholder="your.email@example.com" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <Input placeholder="Brief description of your inquiry" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select a category</option>
                    <option>Billing & Payments</option>
                    <option>Account Services</option>
                    <option>Power Outages</option>
                    <option>Energy Efficiency</option>
                    <option>Membership</option>
                    <option>General Support</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <Textarea 
                    rows={6} 
                    placeholder="Please provide as much detail as possible about your inquiry..."
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Send Message
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Support Promise</h2>
              <p className="text-blue-100">
                We're committed to providing excellent customer service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Emergency Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">&lt;24h</div>
                <div className="text-blue-100">Email Response</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-blue-100">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">3min</div>
                <div className="text-blue-100">Average Wait Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
