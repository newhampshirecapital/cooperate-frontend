import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateUserMembershipRequestMutation, useGetAllCooperativeQuery } from '../../api/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

const MembershipRequestPage = () => {
  const [createUserMembershipRequest, { isLoading }] = useCreateUserMembershipRequestMutation();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { data: cooperativeQuery } = useGetAllCooperativeQuery();
  console.log(cooperativeQuery);

  const [allCooperatives, setAllCooperatives] = useState<any[]>([]);
  console.log(allCooperatives);
  console.log(cooperativeQuery?.data);

  useEffect(() => {
    if (cooperativeQuery?.data) {
      setAllCooperatives(cooperativeQuery.data);
    }
  }, [cooperativeQuery?.data]);
  // Membership Request Form State
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria'
    },
    type: '',
    occupation: '',
    referralSource: '',
    cooperativeId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!membershipForm.name || !membershipForm.email || !membershipForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      toast.loading('Submitting membership request...');
      
      await createUserMembershipRequest({
        name: membershipForm.name,
        email: membershipForm.email,
        phone: membershipForm.phone,
        address: membershipForm.address,
        type: membershipForm.type,
        occupation: membershipForm.occupation,
        referralSource: membershipForm.referralSource,
        cooperativeId: membershipForm.cooperativeId as string
      }).unwrap();
      
      toast.dismiss();
      toast.success('Membership request submitted successfully!');
      
      // Open success modal
      setIsSuccessModalOpen(true);
      
      // Reset form
      setMembershipForm({
        name: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: '', country: 'Nigeria' },
        type: '',
        occupation: '',
        referralSource: '',
        cooperativeId: ''
      });
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.data?.message || 'Failed to submit membership request');
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Request Membership</CardTitle>
            <CardDescription>
              Apply to join our Energy Cooperative
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={membershipForm.name}
                  onChange={(e) => setMembershipForm({...membershipForm, name: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={membershipForm.email}
                  onChange={(e) => setMembershipForm({...membershipForm, email: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={membershipForm.phone}
                  onChange={(e) => setMembershipForm({...membershipForm, phone: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Membership Type</Label>
                <Select 
                  value={membershipForm.type} 
                  onValueChange={(value) => setMembershipForm({...membershipForm, type: value})}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="Enter your occupation"
                  value={membershipForm.occupation}
                  onChange={(e) => setMembershipForm({...membershipForm, occupation: e.target.value})}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Select 
                  value={membershipForm.referralSource} 
                  onValueChange={(value) => setMembershipForm({...membershipForm, referralSource: value})}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                    <SelectItem value="FRIEND_FAMILY">Friend/Family</SelectItem>
                    <SelectItem value="ADVERTISING">Advertising</SelectItem>
                    <SelectItem value="WEBSITE">Website</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cooperativeId">Select your choice cooperative from the dropdown</Label>
                <Select
                  value={membershipForm.cooperativeId}
                  onValueChange={(value) => setMembershipForm({...membershipForm, cooperativeId: value})}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cooperative" />
                  </SelectTrigger>
                  <SelectContent className='max-h-[200px] overflow-y-auto bg-gray-200'>
                    {allCooperatives?.map((cooperative) => (
                      <SelectItem key={cooperative._id} value={cooperative._id}>{cooperative.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
              
              <Button type="submit" className="w-full cursor-pointer hover:bg-blue-900" disabled={isLoading}>
                {isLoading ? 'Submitting Request...' : 'Submit Membership Request'}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-2">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={handleCloseSuccessModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              Membership Request Submitted!
            </DialogTitle>
            <DialogDescription>
              Thank you for your interest in joining our Energy Cooperative. We have received your membership request and will review it carefully.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our team will review your application within 2-3 business days</li>
                <li>• You'll receive an email confirmation shortly</li>
                <li>• We'll contact you via phone or email with updates</li>
                <li>• If approved, you'll receive instructions for next steps</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex-col gap-2">
            <Button onClick={handleCloseSuccessModal} className="w-full">
              Got it, thanks!
            </Button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline"
              >
                Already have an account? Sign in here
              </Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembershipRequestPage;