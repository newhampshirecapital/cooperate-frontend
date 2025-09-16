import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Zap, 
  Sun, 
  Wind, 
  Battery, 
  Home, 
  Building, 
  Factory, 
  Leaf, 
  Shield, 
  
  CheckCircle, 
  ArrowRight,
  DollarSign,

  Users,
  Globe
} from 'lucide-react';

export default function ServicesPage() {
  const mainServices = [
    {
      icon: Zap,
      title: 'Residential Energy',
      description: 'Clean, reliable energy for your home with flexible plans and smart home integration.',
      features: ['100% Renewable Energy', 'Smart Meter Installation', '24/7 Customer Support', 'Flexible Billing'],
      pricing: 'Starting at $0.12/kWh',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building,
      title: 'Commercial Energy',
      description: 'Tailored energy solutions for businesses with cost-saving opportunities and sustainability goals.',
      features: ['Custom Energy Plans', 'Energy Efficiency Consulting', 'Peak Demand Management', 'Sustainability Reporting'],
      pricing: 'Custom Pricing',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Factory,
      title: 'Industrial Solutions',
      description: 'Large-scale energy solutions for industrial facilities with advanced monitoring and optimization.',
      features: ['High-Volume Pricing', 'Advanced Monitoring', 'Load Balancing', 'Backup Power Systems'],
      pricing: 'Volume Discounts',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const renewableSources = [
    {
      icon: Sun,
      title: 'Solar Energy',
      description: 'Harness the power of the sun with our community solar farms and rooftop installations.',
      capacity: '50MW+',
      coverage: '85% of our energy mix'
    },
    {
      icon: Wind,
      title: 'Wind Energy',
      description: 'Clean wind power from our strategically located wind farms across the region.',
      capacity: '30MW+',
      coverage: '12% of our energy mix'
    },
    {
      icon: Battery,
      title: 'Energy Storage',
      description: 'Advanced battery storage systems ensuring reliable power even when renewables are intermittent.',
      capacity: '15MW+',
      coverage: '3% backup capacity'
    }
  ];

  const additionalServices = [
    {
      icon: Home,
      title: 'Home Energy Audits',
      description: 'Comprehensive energy assessments to identify savings opportunities and improve efficiency.',
      benefits: ['Reduce Energy Bills', 'Improve Comfort', 'Increase Home Value', 'Environmental Impact']
    },
    {
      icon: Shield,
      title: 'Energy Monitoring',
      description: 'Real-time energy monitoring and analytics to help you understand and optimize your usage.',
      benefits: ['Real-time Data', 'Usage Analytics', 'Cost Tracking', 'Alerts & Notifications']
    },
    {
      icon: Leaf,
      title: 'Carbon Footprint Tracking',
      description: 'Track your environmental impact and see how your renewable energy choices make a difference.',
      benefits: ['CO₂ Savings Tracking', 'Environmental Reports', 'Sustainability Goals', 'Community Impact']
    },
    {
      icon: Users,
      title: 'Community Programs',
      description: 'Join our community initiatives and educational programs focused on energy conservation.',
      benefits: ['Educational Workshops', 'Community Events', 'Energy Challenges', 'Member Discounts']
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Save up to 30% on your energy bills with our competitive rates and efficiency programs.'
    },
    {
      icon: Leaf,
      title: 'Environmental Impact',
      description: 'Reduce your carbon footprint with 100% renewable energy and sustainable practices.'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Enjoy 99.9% uptime with our robust infrastructure and backup systems.'
    },
    {
      icon: Users,
      title: 'Community Ownership',
      description: 'Be part of a member-owned cooperative that puts people before profits.'
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
              Our <span className="text-yellow-300">Services</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Comprehensive energy solutions for homes, businesses, and communities. 
              From renewable energy to smart home integration, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Main Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Main Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored energy solutions for every need, from residential homes to large industrial facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">{service.pricing}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-lg">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Renewable Energy Sources */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">100% Renewable Energy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our energy comes from clean, renewable sources that protect the environment and ensure sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {renewableSources.map((source, index) => {
              const Icon = source.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{source.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{source.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Capacity:</span>
                        <span className="font-semibold text-green-600">{source.capacity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Coverage:</span>
                        <span className="font-semibold text-blue-600">{source.coverage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond energy supply, we offer comprehensive services to help you optimize your energy usage and reduce costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {service.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EnergyCooperative?</h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Experience the benefits of being part of a member-owned energy cooperative
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-blue-100 leading-relaxed">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Areas */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We proudly serve communities across the region with reliable, renewable energy solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Urban Areas</h3>
                <p className="text-gray-600 mb-4">Serving major cities and metropolitan areas with smart grid technology.</p>
                <Badge variant="secondary">50+ Cities</Badge>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <Home className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Suburban Communities</h3>
                <p className="text-gray-600 mb-4">Reliable energy for residential communities and planned developments.</p>
                <Badge variant="secondary">200+ Communities</Badge>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <Building className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Rural Areas</h3>
                <p className="text-gray-600 mb-4">Extending clean energy access to rural and remote communities.</p>
                <Badge variant="secondary">100+ Rural Areas</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Switch to Clean Energy?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Join thousands of satisfied customers who have made the switch to renewable energy. 
                Get a free quote and start saving today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
