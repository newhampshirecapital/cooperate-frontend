import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Plus, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateMeterApplicationRequestMutation, useUpdateMeterApplicationRequestMutation } from '../../api/api';

interface NewMeterFormProps {
  userId: string;
  cooperateId: string;
  editData?: any;
  onEditComplete?: () => void;
}

const NewMeterForm: React.FC<NewMeterFormProps> = ({ userId, cooperateId, editData, onEditComplete }) => {
  const [createMeterApplicationRequest] = useCreateMeterApplicationRequestMutation();
  const [updateMeterApplicationRequest] = useUpdateMeterApplicationRequestMutation();
  
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    userId: userId,
    cooperativeId: cooperateId,
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria'
    },
    nin: '',
    userType: '',
    lga: '',
    occupation: '',
    accountName: '',
    accountNumber: '',
    accountPhoneNumber: '',
    loadSeperation: false,
    tariffBand: '',
    electricityBusinessUnit: '',
    moreInfo: '',
    status: 'PENDING' as any
  });

  // Populate form with edit data when available
  useEffect(() => {
    if (editData) {
      setFormData({
        userId: userId,
        cooperativeId: cooperateId,
        name: editData.name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        address: editData.address || { street: '', city: '', state: '', country: 'Nigeria' },
        nin: editData.nin || '',
        userType: editData.userType || '',
        lga: editData.lga || '',
        occupation: editData.occupation || '',
        accountName: editData.accountName || '',
        accountNumber: editData.accountNumber || '',
        accountPhoneNumber: editData.accountPhoneNumber || '',
        loadSeperation: editData.loadSeperation || false,
        tariffBand: editData.tariffBand || '',
        electricityBusinessUnit: editData.electricityBusinessUnit || '',
        moreInfo: editData.moreInfo || '',
        status: editData.status || 'PENDING'
      });
    }
  }, [editData, userId, cooperateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (!formData.name || !formData.email || !formData.phone || !formData.nin) {
    //   toast.error('Please fill in all required fields');
    //   return;
    // }

    try {
      const actionText = isEditMode ? 'Updating' : 'Submitting';
      toast.loading(`${actionText} application...`);
      
      const payload = {
        ...formData,
        userType: formData.userType as any,
        tariffBand: formData.tariffBand as any,
        status: formData.status as any
      };

      if (isEditMode) {
        await updateMeterApplicationRequest({
          id: editData._id,
          payload
        }).unwrap();
        toast.dismiss();
        toast.success('Meter application updated successfully!');
        onEditComplete?.();
      } else {
        await createMeterApplicationRequest(payload).unwrap();
        toast.dismiss();
        toast.success('New meter application submitted successfully!');
        
        // Reset form only for new applications
        setFormData({
          userId: userId,
          cooperativeId: cooperateId,
          name: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', country: 'Nigeria' },
          nin: '',
          userType: '',
          lga: '',
          occupation: '',
          accountName: '',
          accountNumber: '',
          accountPhoneNumber: '',
          loadSeperation: false,
          tariffBand: '',
          electricityBusinessUnit: '',
          moreInfo: '',
          status: 'PENDING' as any
        });
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'submit'} application`);
    }
  };

  return (
    <Card className='mt-[30px]'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          {isEditMode ? (
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="text-sm sm:text-base">
            {isEditMode ? 'Edit Meter Application' : 'New Meter Application'}
          </span>
        </CardTitle>
        <CardDescription>
          {isEditMode ? 'Update your meter application details' : 'Apply for a new electricity meter installation'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nin">NIN *</Label>
              <Input
                id="nin"
                value={formData.nin}
                onChange={(e) => setFormData({...formData, nin: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select 
                value={formData.userType} 
                onValueChange={(value) => setFormData({...formData, userType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TENANT">Tenant</SelectItem>
                  <SelectItem value="OWNER">Property Owner</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lga">LGA</Label>
              <Input
                id="lga"
                value={formData.lga}
                onChange={(e) => setFormData({...formData, lga: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tariffBand">Tariff Band</Label>
              <Select 
                value={formData.tariffBand} 
                onValueChange={(value) => setFormData({...formData, tariffBand: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tariff band" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Band A</SelectItem>
                  <SelectItem value="B">Band B</SelectItem>
                  <SelectItem value="C">Band C</SelectItem>
                  <SelectItem value="D">Band D</SelectItem>
                  <SelectItem value="E">Band E</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Address Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, street: e.target.value}
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, city: e.target.value}
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, state: e.target.value}
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="electricityProvider">Electricity Provider</Label>
                <Input
                  id="electricityProvider"
                  value={formData.electricityBusinessUnit}
                  onChange={(e) => setFormData({...formData, electricityBusinessUnit: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Account Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountPhoneNumber">Account Phone Number</Label>
                <Input
                  id="accountPhoneNumber"
                  value={formData.accountPhoneNumber}
                  onChange={(e) => setFormData({...formData, accountPhoneNumber: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Load Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Load Options</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="loadSeperation"
                  checked={formData.loadSeperation}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, loadSeperation: checked as boolean})
                  }
                />
                <Label htmlFor="loadSeperation">Load Separation</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moreInfo">Additional Information</Label>
            <Textarea
              id="moreInfo"
              placeholder="Any additional information about your application..."
              value={formData.moreInfo}
              onChange={(e) => setFormData({...formData, moreInfo: e.target.value})}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {isEditMode ? 'Update Meter Application' : 'Submit New Meter Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewMeterForm;
