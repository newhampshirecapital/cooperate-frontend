import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { FileText, Home, Building, Factory, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMeterAccountApplicationMutation, useUpdateMeterAccountApplicationMutation } from '../../api/api';

interface MeterAccountFormProps {
  userId: string;
  cooperateId: string;
  editData?: any;
  onEditComplete?: () => void;
}

const MeterAccountForm: React.FC<MeterAccountFormProps> = ({ userId, cooperateId, editData, onEditComplete }) => {
  const [createMeterAccountApplication] = useMeterAccountApplicationMutation();
  const [updateMeterAccountApplication] = useUpdateMeterAccountApplicationMutation();
  
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    userId: userId,
    cooperativeId: cooperateId,
    name: '',
    email: '',
    premiseUse: '',
    electricityProvider: '',
    lga: '',
    houseOwner: false,
    landlordName: '',
    landlordPhone: '',
    landlordAddress: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria'
    },
    phone: '',
    typeofHouse: '',
    typeofMeter: 'SINGLE_PHASE' as 'SINGLE_PHASE' | 'THREE_PHASE',
    landMark: '',
    meansOfIdentification: '',
    identificationNumber: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
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
        premiseUse: editData.premiseUse || '',
        electricityProvider: editData.electricityProvider || '',
        lga: editData.lga || '',
        houseOwner: editData.isHouseOwner || false,
        landlordName: editData.landlordName || '',
        landlordPhone: editData.landlordPhone || '',
        landlordAddress: editData.landlordAddress || '',
        address: editData.address || { street: '', city: '', state: '', country: 'Nigeria' },
        typeofHouse: editData.typeofHouse || '',
        typeofMeter: editData.typeofMeter || 'SINGLE_PHASE',
        landMark: editData.landMark || '',
        meansOfIdentification: editData.meansOfIdentification || '',
        identificationNumber: editData.identificationNumber || '',
        status: editData.status || 'pending'
      });
    }
  }, [editData, userId, cooperateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (!formData.name || !formData.email || !formData.phone || 
    //     !formData.meansOfIdentification || !formData.identificationNumber ||
    //     !formData.address.street || !formData.address.city || 
    //     !formData.address.state || !formData.address.country) {
    //   toast.error('Please fill in all required fields');
    //   return;
    // }

    try {
      const actionText = isEditMode ? 'Updating' : 'Submitting';
      toast.loading(`${actionText} application...`);
      
      const payload = {
        ...formData,
        typeofMeter: formData.typeofMeter as any,
        status: formData.status as any
      };

      if (isEditMode) {
        await updateMeterAccountApplication({
          id: editData._id,
          payload
        }).unwrap();
        toast.dismiss();
        toast.success('Meter account application updated successfully!');
        onEditComplete?.();
      } else {
        await createMeterAccountApplication(payload).unwrap();
        toast.dismiss();
        toast.success('Meter account application submitted successfully!');
        
        // Reset form only for new applications
        setFormData({
          userId: userId,
          cooperativeId: cooperateId,
          name: '',
          email: '',
          premiseUse: '',
          electricityProvider: '',
          lga: '',
          houseOwner: false,
          landlordName: '',
          landlordPhone: '',
          landlordAddress: '',
          address: { street: '', city: '', state: '', country: 'Nigeria' },
          phone: '',
          typeofHouse: '',
          typeofMeter: 'SINGLE_PHASE' as 'SINGLE_PHASE' | 'THREE_PHASE',
          landMark: '',
          meansOfIdentification: '',
          identificationNumber: '',
          status: 'pending' as 'pending' | 'approved' | 'rejected'
        });
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'submit'} application`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          {isEditMode ? (
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="text-sm sm:text-base">
            {isEditMode ? 'Edit Meter Account Application' : 'Meter Account Request'}
          </span>
        </CardTitle>
        <CardDescription>
          {isEditMode ? 'Update your meter account application details' : 'Request a new meter account for existing meter'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meterName">Full Name *</Label>
              <Input
                id="meterName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meterEmail">Email Address *</Label>
              <Input
                id="meterEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meterPhone">Phone Number *</Label>
              <Input
                id="meterPhone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="premiseUse">Premise Use</Label>
              <Select 
                value={formData.premiseUse} 
                onValueChange={(value) => setFormData({...formData, premiseUse: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select premise use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Residential
                    </div>
                  </SelectItem>
                  <SelectItem value="Commercial">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Commercial
                    </div>
                  </SelectItem>
                  <SelectItem value="Industrial">
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4" />
                      Industrial
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meterType">Meter Type</Label>
              <Select 
                value={formData.typeofMeter} 
                onValueChange={(value) => setFormData({...formData, typeofMeter: value as 'SINGLE_PHASE' | 'THREE_PHASE'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_PHASE">Single Phase</SelectItem>
                  <SelectItem value="THREE_PHASE">Three Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="houseType">House Type</Label>
              <Select 
                value={formData.typeofHouse} 
                onValueChange={(value) => setFormData({...formData, typeofHouse: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select house type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bungalow">Bungalow</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Mansion">Mansion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="electricityProvider">Electricity Provider</Label>
              <Input
                id="electricityProvider"
                value={formData.electricityProvider}
                onChange={(e) => setFormData({...formData, electricityProvider: e.target.value})}
                placeholder="e.g., EKEDC, IKEDC, PHED"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lga">Local Government Area (LGA)</Label>
              <Input
                id="lga"
                value={formData.lga}
                onChange={(e) => setFormData({...formData, lga: e.target.value})}
                placeholder="Enter your LGA"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Address Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressStreet">Street Address *</Label>
                <Input
                  id="addressStreet"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, street: e.target.value}
                  })}
                  required
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressCity">City *</Label>
                <Input
                  id="addressCity"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, city: e.target.value}
                  })}
                  required
                  placeholder="Enter city"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressState">State *</Label>
                <Input
                  id="addressState"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, state: e.target.value}
                  })}
                  required
                  placeholder="Enter state"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressCountry">Country *</Label>
                <Input
                  id="addressCountry"
                  value={formData.address.country}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, country: e.target.value}
                  })}
                  required
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* House Owner Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="houseOwner"
                checked={formData.houseOwner}
                onCheckedChange={(checked) => 
                  setFormData({...formData, houseOwner: checked as boolean})
                }
              />
              <Label htmlFor="houseOwner">I am the house owner</Label>
            </div>
            
            {!formData.houseOwner && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="landlordName">Landlord Name</Label>
                  <Input
                    id="landlordName"
                    value={formData.landlordName}
                    onChange={(e) => setFormData({...formData, landlordName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landlordPhone">Landlord Phone</Label>
                  <Input
                    id="landlordPhone"
                    value={formData.landlordPhone}
                    onChange={(e) => setFormData({...formData, landlordPhone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="landlordAddress">Landlord Address</Label>
                  <Input
                    id="landlordAddress"
                    value={formData.landlordAddress}
                    onChange={(e) => setFormData({...formData, landlordAddress: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Identification Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Identification Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meansOfIdentification">Means of Identification *</Label>
                <Select 
                  value={formData.meansOfIdentification} 
                  onValueChange={(value) => setFormData({...formData, meansOfIdentification: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select identification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NIN">National Identification Number (NIN)</SelectItem>
                    <SelectItem value="Driver's License">Driver's License</SelectItem>
                    <SelectItem value="International Passport">International Passport</SelectItem>
                    <SelectItem value="Voter's Card">Voter's Card</SelectItem>
                    <SelectItem value="Bank Verification Number">Bank Verification Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="identificationNumber">Identification Number *</Label>
                <Input
                  id="identificationNumber"
                  value={formData.identificationNumber}
                  onChange={(e) => setFormData({...formData, identificationNumber: e.target.value})}
                  required
                  placeholder="Enter your identification number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="landMark">Landmark (Optional)</Label>
              <Input
                id="landMark"
                value={formData.landMark}
                onChange={(e) => setFormData({...formData, landMark: e.target.value})}
                placeholder="Enter nearby landmark for easy identification"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {isEditMode ? 'Update Meter Account Application' : 'Submit Meter Account Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MeterAccountForm;
