import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  Zap,
  Leaf,
  DollarSign,
  Shield,
  Users,
 
} from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: 'General Questions',
      icon: HelpCircle,
      color: 'from-blue-500 to-cyan-500',
      questions: [
        {
          question: 'What is EnergyCooperative?',
          answer: 'EnergyCooperative is a member-owned energy cooperative that provides 100% renewable energy to communities. We are democratically governed by our members and focus on sustainability, affordability, and community benefit rather than profit maximization.'
        },
        {
          question: 'How is a cooperative different from a traditional utility?',
          answer: 'Unlike traditional utilities that are investor-owned, cooperatives are owned by their members. This means profits are returned to members, decisions are made democratically, and the focus is on member benefit rather than shareholder returns. We also prioritize renewable energy and community development.'
        },
        {
          question: 'Who can become a member?',
          answer: 'Anyone who lives or works in our service area can become a member. This includes residential customers, businesses, and organizations. Membership is open to all, regardless of income level or property ownership status.'
        },
        {
          question: 'How do I become a member?',
          answer: 'Becoming a member is simple! You can apply online through our website, call our customer service team, or visit one of our local offices. The process typically takes 1-2 business days, and you\'ll start receiving renewable energy immediately upon approval.'
        }
      ]
    },
    {
      title: 'Energy & Services',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      questions: [
        {
          question: 'What types of renewable energy do you provide?',
          answer: 'We provide 100% renewable energy from multiple sources including solar (85%), wind (12%), and other renewable sources (3%). Our energy mix is constantly evolving as we add more renewable capacity to our portfolio.'
        },
        {
          question: 'How reliable is renewable energy?',
          answer: 'Our renewable energy is extremely reliable with a 99.9% uptime guarantee. We use advanced energy storage systems, smart grid technology, and backup systems to ensure consistent power delivery even when weather conditions affect renewable generation.'
        },
        {
          question: 'Do you offer smart home services?',
          answer: 'Yes! We offer smart meter installation, home energy monitoring systems, and integration with popular smart home platforms. These services help you optimize your energy usage and reduce costs while maintaining comfort.'
        },
        {
          question: 'What energy efficiency programs do you offer?',
          answer: 'We offer comprehensive energy efficiency programs including home energy audits, rebates for energy-efficient appliances, LED lighting programs, and weatherization assistance. These programs can help reduce your energy consumption by up to 30%.'
        }
      ]
    },
    {
      title: 'Billing & Payments',
      icon: DollarSign,
      color: 'from-purple-500 to-violet-500',
      questions: [
        {
          question: 'How are rates determined?',
          answer: 'Our rates are set by our member-elected board of directors and are designed to cover operational costs while providing fair, affordable pricing. Unlike investor-owned utilities, we don\'t need to generate profits for shareholders, which helps keep rates competitive.'
        },
        {
          question: 'What payment options are available?',
          answer: 'We offer multiple payment options including online payments, automatic bank draft, credit/debit cards, money orders, and in-person payments at our offices. We also offer budget billing and payment assistance programs for qualifying members.'
        },
        {
          question: 'Do you offer any discounts or special rates?',
          answer: 'Yes! We offer discounts for seniors, low-income households, and members who participate in our energy efficiency programs. We also have special rates for electric vehicle charging and time-of-use pricing options.'
        },
        {
          question: 'What happens if I can\'t pay my bill?',
          answer: 'We understand that financial difficulties can happen. We offer payment plans, energy assistance programs, and work with local social service agencies to help members in need. Contact our customer service team as soon as possible to discuss your options.'
        }
      ]
    },
    {
      title: 'Membership & Governance',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      questions: [
        {
          question: 'How does cooperative governance work?',
          answer: 'Our cooperative is governed by a board of directors elected by our members. Each member has one vote regardless of how much energy they use. Members can run for the board, vote in elections, and participate in annual meetings where major decisions are made.'
        },
        {
          question: 'What are capital credits?',
          answer: 'Capital credits represent your share of the cooperative\'s margins (profits). When the cooperative has excess revenue, it\'s allocated to members based on their energy usage. These credits are typically returned to members over time, providing additional value beyond competitive rates.'
        },
        {
          question: 'How can I get involved in the cooperative?',
          answer: 'There are many ways to get involved! You can attend annual meetings, run for the board of directors, join committees, participate in member surveys, or volunteer for community events. We also have a member advisory council that provides input on policies and programs.'
        },
        {
          question: 'What is the difference between a member and a customer?',
          answer: 'All members are customers, but not all customers are members. Members own the cooperative, have voting rights, receive capital credits, and can participate in governance. Non-members can still receive our services but don\'t have ownership rights or voting privileges.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: Shield,
      color: 'from-indigo-500 to-blue-500',
      questions: [
        {
          question: 'What should I do if I have a power outage?',
          answer: 'First, check if your neighbors are also experiencing an outage. If so, report it to our 24/7 emergency line. We have automated systems that help us quickly identify and respond to outages. You can also check our outage map on our website for real-time updates.'
        },
        {
          question: 'How do I report an electrical emergency?',
          answer: 'For electrical emergencies, call our 24/7 emergency line immediately. This includes downed power lines, electrical fires, or other dangerous situations. Never approach downed power lines - stay at least 30 feet away and call emergency services.'
        },
        {
          question: 'Do you provide electrical services and repairs?',
          answer: 'We provide service to the meter, but internal wiring and electrical repairs are the responsibility of the property owner. However, we can recommend licensed electricians in your area and provide guidance on electrical safety and code compliance.'
        },
        {
          question: 'How do I read my smart meter?',
          answer: 'Smart meters automatically send usage data to us, so you don\'t need to read them manually. However, you can view your real-time usage through our online portal or mobile app. The meter display shows current usage, cumulative usage, and other diagnostic information.'
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: '24/7 emergency and customer service',
      contact: '1-800-ENERGY-1',
      hours: '24/7 Emergency, 8AM-6PM Customer Service'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@energycooperative.com',
      hours: 'Response within 24 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available on website',
      hours: '8AM-6PM Monday-Friday'
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
              Frequently Asked <span className="text-yellow-300">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Find answers to common questions about our services, membership, billing, and more. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Search Bar */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 text-lg py-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={categoryIndex}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  <Badge variant="secondary">{category.questions.length} questions</Badge>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isExpanded = expandedItems.includes(globalIndex);
                    
                    return (
                      <Card key={faqIndex} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleExpanded(globalIndex)}
                            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-6 pb-6">
                              <div className="border-t pt-4">
                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any FAQs matching "{searchTerm}". Try different keywords or contact our support team.
            </p>
            <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our support team is here to help you with any questions or concerns. 
              Choose the contact method that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-600">{method.contact}</p>
                      <p className="text-sm text-gray-500">{method.hours}</p>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Quick Links</h2>
                <p className="text-blue-100">
                  Find more information and resources
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety Tips
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Rate Information
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Leaf className="w-4 h-4 mr-2" />
                  Energy Efficiency
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Users className="w-4 h-4 mr-2" />
                  Member Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
