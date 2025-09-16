import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "December 15, 2024";

  const dataTypes = [
    {
      icon: Users,
      title: 'Personal Information',
      description: 'Name, address, phone number, email address, and account details',
      examples: ['Full name and contact information', 'Service address and billing address', 'Account numbers and payment information']
    },
    {
      icon: Zap,
      title: 'Energy Usage Data',
      description: 'Meter readings, consumption patterns, and energy usage history',
      examples: ['Hourly, daily, and monthly usage data', 'Peak demand information', 'Energy efficiency metrics']
    },
    {
      icon: Shield,
      title: 'Account Information',
      description: 'Account status, payment history, and service preferences',
      examples: ['Payment methods and billing history', 'Service agreements and contracts', 'Communication preferences']
    }
  ];

  const dataUses = [
    {
      title: 'Service Provision',
      description: 'To provide reliable energy services and maintain your account',
      details: ['Billing and payment processing', 'Service delivery and maintenance', 'Customer support and communication']
    },
    {
      title: 'Energy Management',
      description: 'To optimize energy delivery and improve system efficiency',
      details: ['Load balancing and grid optimization', 'Outage prevention and response', 'Energy efficiency programs']
    },
    {
      title: 'Regulatory Compliance',
      description: 'To meet legal and regulatory requirements',
      details: ['Reporting to regulatory agencies', 'Compliance with energy regulations', 'Safety and reliability standards']
    },
    {
      title: 'Member Benefits',
      description: 'To provide enhanced services and member benefits',
      details: ['Energy efficiency recommendations', 'Customized rate plans', 'Community programs and initiatives']
    }
  ];

  const dataProtection = [
    {
      icon: Lock,
      title: 'Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard protocols'
    },
    {
      icon: Shield,
      title: 'Access Controls',
      description: 'Strict access controls limit who can view and modify your personal information'
    },
    {
      icon: Eye,
      title: 'Monitoring',
      description: 'Continuous monitoring and auditing of data access and usage'
    },
    {
      icon: Users,
      title: 'Training',
      description: 'Regular training for all employees on data protection and privacy practices'
    }
  ];

  const yourRights = [
    {
      title: 'Access Your Data',
      description: 'Request a copy of all personal information we have about you',
      action: 'Contact our privacy officer to request your data'
    },
    {
      title: 'Correct Information',
      description: 'Request corrections to inaccurate or incomplete information',
      action: 'Update your information through your online account or contact us'
    },
    {
      title: 'Delete Your Data',
      description: 'Request deletion of your personal information (subject to legal requirements)',
      action: 'Submit a deletion request through our privacy portal'
    },
    {
      title: 'Data Portability',
      description: 'Request your data in a portable format for transfer to another provider',
      action: 'Contact our privacy officer for data export assistance'
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
              Privacy <span className="text-yellow-300">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Last Updated: {lastUpdated}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  At EnergyCooperative, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  As a member-owned cooperative, we believe in transparency and putting our members first. We will never sell your personal 
                  information to third parties, and we only use your data to provide you with the best possible energy services.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                      <p className="text-blue-800">
                        This policy applies to all members and customers of EnergyCooperative. By using our services, 
                        you agree to the collection and use of information in accordance with this policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information We Collect */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collect only the information necessary to provide you with reliable energy services and improve our operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dataTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Examples include:</p>
                      {type.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-700">{example}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use your information only for legitimate business purposes related to providing energy services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataUses.map((use, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{use.title}</h3>
                  <p className="text-gray-600 mb-4">{use.description}</p>
                  <div className="space-y-2">
                    {use.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Protection */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Protect Your Information</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement comprehensive security measures to protect your personal information from unauthorized access, 
              use, or disclosure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataProtection.map((protection, index) => {
              const Icon = protection.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{protection.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{protection.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Your Rights */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You have important rights regarding your personal information. We respect and support these rights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {yourRights.map((right, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{right.title}</h3>
                  <p className="text-gray-600 mb-4">{right.description}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">How to exercise this right:</p>
                    <p className="text-sm text-gray-600">{right.action}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h2>
                <p className="text-blue-100 text-lg">
                  Contact our Privacy Officer for any questions or concerns about this policy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-blue-100">privacy@energycooperative.com</p>
                </div>
                <div className="text-center">
                  <Phone className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-blue-100">1-800-PRIVACY-1</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Mail</h3>
                  <p className="text-blue-100">Privacy Officer<br />EnergyCooperative<br />123 Energy St, Green City, GC 12345</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Updates */}
        <div className="text-center">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the updated policy on our website and sending you a notice.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Download PDF Version
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  Print Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
