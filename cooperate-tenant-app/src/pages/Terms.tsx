import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  FileText, 
  Scale, 
  Users, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      title: 'Service Agreement',
      description: 'Terms governing the provision of energy services',
      items: [
        'Service availability and reliability standards',
        'Member responsibilities and obligations',
        'Service connection and disconnection procedures',
        'Emergency and outage response protocols'
      ]
    },
    {
      title: 'Billing & Payments',
      description: 'Terms related to billing, payments, and account management',
      items: [
        'Billing cycles and payment due dates',
        'Late payment fees and collection procedures',
        'Payment methods and security',
        'Account balance and credit policies'
      ]
    },
    {
      title: 'Member Rights',
      description: 'Rights and privileges of cooperative members',
      items: [
        'Voting rights and democratic participation',
        'Access to financial information and reports',
        'Capital credit allocations and distributions',
        'Member meeting participation and proxy voting'
      ]
    },
    {
      title: 'Safety & Compliance',
      description: 'Safety requirements and regulatory compliance',
      items: [
        'Electrical safety standards and requirements',
        'Meter access and installation guidelines',
        'Regulatory compliance and reporting',
        'Environmental protection and sustainability'
      ]
    }
  ];

  const keyTerms = [
    {
      term: 'Member-Owned Cooperative',
      definition: 'A business organization owned and controlled by the people who use its services, with profits returned to members rather than external shareholders.'
    },
    {
      term: 'Capital Credits',
      definition: 'Allocated margins (profits) that represent each member\'s ownership interest in the cooperative, typically returned to members over time.'
    },
    {
      term: 'Service Territory',
      definition: 'The geographic area where the cooperative is authorized to provide electric service, as defined by regulatory authorities.'
    },
    {
      term: 'Rate Schedule',
      definition: 'The approved pricing structure for different types of service, including base rates, demand charges, and special rate options.'
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
              Terms of <span className="text-yellow-300">Service</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              The terms and conditions governing your membership and energy service with EnergyCooperative.
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
                <Scale className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement Overview</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  These Terms of Service ("Terms") govern your relationship with EnergyCooperative ("we," "us," or "our") 
                  regarding your membership and the provision of electric service. By becoming a member or using our services, 
                  you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  As a member-owned cooperative, we operate under democratic principles and are committed to providing 
                  reliable, affordable, and sustainable energy services to our community.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                      <p className="text-blue-800">
                        Please read these Terms carefully. If you do not agree to these Terms, you may not use our services. 
                        We reserve the right to modify these Terms at any time, and your continued use of our services 
                        constitutes acceptance of any changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Sections */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Terms & Conditions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important terms and conditions that govern your membership and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <p className="text-gray-600">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Definitions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Definitions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important terms and definitions used throughout these Terms of Service
            </p>
          </div>

          <div className="space-y-6">
            {keyTerms.map((term, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{term.term}</h3>
                      <p className="text-gray-700 leading-relaxed">{term.definition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Member Responsibilities */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Member Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Obligations</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Pay bills on time and maintain good credit standing</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Provide safe access to meters and equipment</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Report electrical hazards and safety concerns</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Comply with electrical codes and safety standards</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitments</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Provide reliable, safe, and affordable energy service</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Maintain transparent and democratic governance</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Invest in renewable energy and sustainability</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Provide excellent customer service and support</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
                <p className="text-blue-100 text-lg">
                  Contact our legal department for clarification or questions about these terms
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Legal Department</h3>
                  <p className="text-blue-100">legal@energycooperative.com</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Member Services</h3>
                  <p className="text-blue-100">1-800-MEMBER-1</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Compliance</h3>
                  <p className="text-blue-100">compliance@energycooperative.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Updates */}
        <div className="text-center">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms Updates</h2>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                We may update these Terms of Service from time to time to reflect changes in our services, 
                legal requirements, or business practices. We will notify members of any material changes 
                through our website, email, or other appropriate means.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Download PDF Version
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  Print Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
