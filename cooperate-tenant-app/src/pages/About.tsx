import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Target, 

  Heart, 
  Leaf, 

  Shield, 
  Globe,
 
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to 100% renewable energy and environmental responsibility'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Member-owned cooperative putting people before profits'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: '99.9% uptime with robust infrastructure and backup systems'
    },
    {
      icon: Heart,
      title: 'Transparency',
      description: 'Open communication and democratic decision-making processes'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Founded',
      description: 'EnergyCooperative was established by a group of environmentally conscious community members'
    },
    {
      year: '2019',
      title: 'First 100 Members',
      description: 'Reached our first milestone of 100 cooperative members'
    },
    {
      year: '2020',
      title: 'Solar Farm Launch',
      description: 'Opened our first community solar farm with 5MW capacity'
    },
    {
      year: '2021',
      title: 'Wind Energy',
      description: 'Added wind energy to our renewable portfolio'
    },
    {
      year: '2022',
      title: '10,000 Members',
      description: 'Celebrated reaching 10,000 active cooperative members'
    },
    {
      year: '2023',
      title: 'Carbon Neutral',
      description: 'Achieved carbon neutrality across all operations'
    }
  ];

  const team = [
    {
      name: 'Chidinma',
      role: 'Product',
      image: '👩‍💼',
      bio: 'Former renewable energy engineer with 15+ years experience in sustainable energy solutions.'
    },
    {
      name: 'Nicholas',
      role: 'CTO',
      image: '👨‍💻',
      bio: 'Technology leader specializing in smart grid systems and energy management platforms.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Relations Director',
      image: '👩‍🤝‍👩',
      bio: 'Passionate about building strong community partnerships and member engagement.'
    },
    {
      name: 'David Thompson',
      role: 'Operations Manager',
      image: '👨‍🔧',
      bio: 'Ensures reliable energy delivery and maintains our 99.9% uptime record.'
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
              About <span className="text-yellow-300">EnergyCooperative</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering communities through sustainable energy solutions. 
              We're a member-owned cooperative dedicated to creating a cleaner, 
              more affordable energy future for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Join Our Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                To democratize access to clean, affordable energy by building a community-owned 
                cooperative that puts people and the planet first.
              </p>
              <p className="text-gray-600">
                We believe that energy should be a public good, not a commodity for profit. 
                Our mission is to provide reliable, renewable energy while fostering community 
                engagement and environmental stewardship.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                A world where every community has access to clean, affordable, and reliable energy 
                through cooperative ownership and democratic governance.
              </p>
              <p className="text-gray-600">
                We envision a future where energy cooperatives lead the transition to 100% renewable 
                energy, creating resilient communities and a sustainable planet for future generations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape our commitment to our members and the environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Our Story Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small group of visionaries to a thriving community of thousands, 
              here's how we've grown and evolved.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                        </div>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center relative z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the passionate leaders driving our mission forward and building 
              a sustainable energy future for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">By the Numbers</h2>
                <p className="text-xl text-blue-100">
                  Our impact in the community and environment
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">15,000+</div>
                  <div className="text-blue-100">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                  <div className="text-blue-100">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                  <div className="text-blue-100">Renewable Energy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">2,500+</div>
                  <div className="text-blue-100">Tons CO₂ Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Become part of a movement that's transforming how communities access and 
                manage their energy. Together, we can build a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Become a Member
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
