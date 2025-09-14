
import { useState } from 'react';
import { useCreateCooperativeMutation, useGetUserQuery } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Zap } from 'lucide-react';

const CreateCooperative = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    registrationNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: ''
    }
  });

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [createCooperative, { isLoading }] = useCreateCooperativeMutation();
  const { refetch: refetchUser } = useGetUserQuery();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const payload = {
        ...formData,
        adminId: user._id
      };

      await createCooperative(payload).unwrap();
      
      // Refetch user data to get updated cooperativeId
      const userData: any = await refetchUser();
      
      if (userData.data?.data) {
        // Normalize the data - handle API typo (cooperateId vs cooperativeId)
        const normalizedUserData = {
          ...userData.data.data,
          cooperativeId: userData.data.data.cooperateId || userData.data.data.cooperativeId
        };
        
        // Update AuthContext with the fresh user data
        await updateUser(normalizedUserData);
        
        toast.success('Cooperative created successfully!');
        navigate('/');
      } else {
        toast.error('Failed to update user data');
      }
    } catch (error: any) {
      console.error('Failed to create cooperative:', error);
      toast.error(error?.data?.message || 'Failed to create cooperative');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className='text-center'>
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Create Your Cooperative</CardTitle>
          <CardDescription>
            Set up your energy cooperative to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="">
              <div className="space-y-2">
                <Label htmlFor="name">Cooperative Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                placeholder="e.g., Green Valley Energy Cooperative"
                disabled={isLoading}
                />
              </div>
              
             
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                  placeholder="Describe your cooperative's mission and goals..."
                rows={3}
                disabled={isLoading}
              />
            </div>

           

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.street">Street Address *</Label>
                  <Input
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter street address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.city">City *</Label>
                  <Input
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.state">State *</Label>
                  <Input
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter state"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.country">Country *</Label>
                  <Input
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You'll be able to invite members to join</li>
                <li>• Set up energy trading preferences</li>
                <li>• Monitor energy usage and transactions</li>
                <li>• Manage cooperative settings</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Cooperative'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

  );
};

export default CreateCooperative;
