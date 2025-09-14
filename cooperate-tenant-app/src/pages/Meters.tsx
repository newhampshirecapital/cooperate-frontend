import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Gauge, 
  Plus, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Building,
  Factory,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateMeterApplicationRequestMutation, useGetUserMeterAccountApplicationsQuery, useMeterAccountApplicationMutation, useGetUserMeterApplicationRequestsQuery } from '../api/api';
import { useAuth } from '../context/AuthContext';

export function MetersPage() {
  const { user } = useAuth();
  const userId = user?._id || '';
  //console.log('User ID from auth:', userId);

  const cooperateId = user?.cooperateId || user?.cooperateId || '';
  const [activeTab, setActiveTab] = useState('new-meter');
  
  // API hooks
  const [createMeterAccountApplication] = useMeterAccountApplicationMutation()
  const {data: userMeterApplications} = useGetUserMeterAccountApplicationsQuery({id: userId})
  const [createMeterApplicationRequest] = useCreateMeterApplicationRequestMutation()
  const {data: userMeterApplicationRequests} = useGetUserMeterApplicationRequestsQuery({id: userId})

  console.log('userMeterApplicationRequests', userMeterApplicationRequests)
  console.log('userMeterApplications', userMeterApplications)
  console.log('userMeterApplications data structure:', userMeterApplications?.data)
  console.log('userMeterApplicationRequests data structure:', userMeterApplicationRequests?.data)
  //console.log('existingApplications:', existingApplications)
  //console.log('existingApplications length:', existingApplications.length)
 
  
  // New Meter Application Form State
  const [newMeterForm, setNewMeterForm] = useState({
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

  // New Meter Account Form State
  const [meterAccountForm, setMeterAccountForm] = useState({
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


  const handleNewMeterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMeterForm.name || !newMeterForm.email || !newMeterForm.phone || !newMeterForm.nin) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      toast.loading('Submitting application...');
      
      await createMeterApplicationRequest({
        ...newMeterForm,
        userType: newMeterForm.userType as any,
        tariffBand: newMeterForm.tariffBand as any,
        status: 'PENDING' as any
      }).unwrap();
      
      toast.dismiss();
      toast.success('New meter application submitted successfully!');
      
      // Reset form
      setNewMeterForm({
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
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.data?.message || 'Failed to submit application');
    }
  };

  const handleMeterAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meterAccountForm.name || !meterAccountForm.email || !meterAccountForm.phone || 
        !meterAccountForm.meansOfIdentification || !meterAccountForm.identificationNumber ||
        !meterAccountForm.address.street || !meterAccountForm.address.city || 
        !meterAccountForm.address.state || !meterAccountForm.address.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      toast.loading('Submitting application...');
      
      await createMeterAccountApplication({
        ...meterAccountForm,
        typeofMeter: meterAccountForm.typeofMeter as any,
        status: 'pending' as any
      }).unwrap();
      
      toast.dismiss();
      toast.success('Meter account application submitted successfully!');
      
      // Reset form
      setMeterAccountForm({
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
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.data?.message || 'Failed to submit application');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // CRUD handlers for applications
  const handleViewApplication = (applicationId: string, applicationType: 'meter-account' | 'new-meter') => {
    let application;
    if (applicationType === 'meter-account') {
      application = userMeterApplications?.data?.data?.find((app: any) => app._id === applicationId);
    } else {
      application = userMeterApplicationRequests?.data?.data?.find((app: any) => app._id === applicationId);
    }
    
    if (application) {
      toast.success(`Viewing ${applicationType === 'meter-account' ? 'Meter Account' : 'New Meter'} application`);
      console.log('Viewing application:', application);
      // You can add a modal or navigate to a detailed view here
    }
  };

  const handleEditApplication = (applicationId: string, applicationType: 'meter-account' | 'new-meter') => {
    let application;
    if (applicationType === 'meter-account') {
      application = userMeterApplications?.data?.data?.find((app: any) => app._id === applicationId);
    } else {
      application = userMeterApplicationRequests?.data?.data?.find((app: any) => app._id === applicationId);
    }
    
    if (application) {
      toast.success(`Editing ${applicationType === 'meter-account' ? 'Meter Account' : 'New Meter'} application`);
      console.log('Editing application:', application);
      
      // Pre-fill the appropriate form based on application type
      if (applicationType === 'meter-account') {
        setMeterAccountForm({
          userId: userId,
          cooperativeId: cooperateId,
          name: application.name || '',
          email: application.email || '',
          phone: application.phone || '',
          premiseUse: application.premiseUse || '',
          electricityProvider: application.electricityProvider || '',
          lga: application.lga || '',
          houseOwner: application.isHouseOwner || false,
          landlordName: application.landlordName || '',
          landlordPhone: application.landlordPhone || '',
          landlordAddress: application.landlordAddress || '',
          address: application.address || { street: '', city: '', state: '', country: 'Nigeria' },
          typeofHouse: application.houseType || '',
          typeofMeter: application.typeofMeter || 'SINGLE_PHASE',
          landMark: application.landMark || '',
          meansOfIdentification: application.meansOfIdentification || '',
          identificationNumber: application.identificationNumber || '',
          status: application.status || 'pending'
        });
        setActiveTab('meter-account');
      } else {
        setNewMeterForm({
          userId: userId,
          cooperativeId: user?.cooperateId || user?.cooperativeId || '',
          name: application.name || '',
          email: application.email || '',
          phone: application.phone || '',
          address: application.address || { street: '', city: '', state: '', country: '' },
          nin: application.nin || '',
          userType: application.userType || 'OWNER',
          lga: application.lga || '',
          occupation: application.occupation || '',
          accountName: application.accountName || '',
          accountNumber: application.accountNumber || '',
          accountPhoneNumber: application.accountPhoneNumber || '',
          loadSeperation: application.loadSeperation || false,
          tariffBand: application.tariffBand || '',
          electricityBusinessUnit: application.electricityBusinessUnit || '',
          moreInfo: application.moreInfo || '',
          status: application.status || 'pending'
        });
        setActiveTab('new-meter');
      }
    }
  };

  const handleDeleteApplication = async (applicationId: string, applicationType: 'meter-account' | 'new-meter') => {
    let application;
    if (applicationType === 'meter-account') {
      application = userMeterApplications?.data?.data?.find((app: any) => app._id === applicationId);
    } else {
      application = userMeterApplicationRequests?.data?.data?.find((app: any) => app._id === applicationId);
    }
    
    if (application) {
      const applicationTypeName = applicationType === 'meter-account' ? 'Meter Account' : 'New Meter';
      if (window.confirm(`Are you sure you want to delete this ${applicationTypeName} application?`)) {
        try {
          toast.loading('Deleting application...');
          // You can add delete API call here
          // await deleteApplication(applicationId, applicationType);
          toast.dismiss();
          toast.success(`${applicationTypeName} application deleted successfully`);
          console.log('Deleting application:', application);
        } catch (error) {
          toast.dismiss();
          toast.error('Failed to delete application');
          console.error('Delete error:', error);
        }
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Meter Services</h2>
          <p className="text-sm sm:text-base text-gray-600">Apply for new meters and manage your applications</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <TabsTrigger value="new-meter" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">New Meter Application</span>
            <span className="sm:hidden">New Meter</span>
          </TabsTrigger>
          <TabsTrigger value="meter-account" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Meter Account Request</span>
            <span className="sm:hidden">Account Request</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-xs  sm:text-sm  col-span-2 sm:col-span-1">
            <span className="hidden sm:inline">My Applications</span>
            <span className="sm:hidden ">Applications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-meter" className="space-y-4 ">
          <Card className='mt-[30px]'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">New Meter Application</span>
              </CardTitle>
              <CardDescription>
                Apply for a new electricity meter installation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewMeterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newMeterForm.name}
                      onChange={(e) => setNewMeterForm({...newMeterForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMeterForm.email}
                      onChange={(e) => setNewMeterForm({...newMeterForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newMeterForm.phone}
                      onChange={(e) => setNewMeterForm({...newMeterForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nin">NIN *</Label>
                    <Input
                      id="nin"
                      value={newMeterForm.nin}
                      onChange={(e) => setNewMeterForm({...newMeterForm, nin: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userType">User Type</Label>
                    <Select 
                      value={newMeterForm.userType} 
                      onValueChange={(value) => setNewMeterForm({...newMeterForm, userType: value})}
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
                      value={newMeterForm.lga}
                      onChange={(e) => setNewMeterForm({...newMeterForm, lga: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={newMeterForm.occupation}
                      onChange={(e) => setNewMeterForm({...newMeterForm, occupation: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tariffBand">Tariff Band</Label>
                    <Select 
                      value={newMeterForm.tariffBand} 
                      onValueChange={(value) => setNewMeterForm({...newMeterForm, tariffBand: value})}
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
                        value={newMeterForm.address.street}
                        onChange={(e) => setNewMeterForm({
                          ...newMeterForm, 
                          address: {...newMeterForm.address, street: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newMeterForm.address.city}
                        onChange={(e) => setNewMeterForm({
                          ...newMeterForm, 
                          address: {...newMeterForm.address, city: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newMeterForm.address.state}
                        onChange={(e) => setNewMeterForm({
                          ...newMeterForm, 
                          address: {...newMeterForm.address, state: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="electricityProvider">Electricity Provider</Label>
                      <Input
                        id="electricityProvider"
                        value={newMeterForm.electricityBusinessUnit}
                        onChange={(e) => setNewMeterForm({...newMeterForm, electricityBusinessUnit: e.target.value})}
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
                        value={newMeterForm.accountName}
                        onChange={(e) => setNewMeterForm({...newMeterForm, accountName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={newMeterForm.accountNumber}
                        onChange={(e) => setNewMeterForm({...newMeterForm, accountNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountPhoneNumber">Account Phone Number</Label>
                      <Input
                        id="accountPhoneNumber"
                        value={newMeterForm.accountPhoneNumber}
                        onChange={(e) => setNewMeterForm({...newMeterForm, accountPhoneNumber: e.target.value})}
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
                        checked={newMeterForm.loadSeperation}
                        onCheckedChange={(checked) => 
                          setNewMeterForm({...newMeterForm, loadSeperation: checked as boolean})
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
                    value={newMeterForm.moreInfo}
                    onChange={(e) => setNewMeterForm({...newMeterForm, moreInfo: e.target.value})}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit New Meter Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meter-account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Meter Account Request</span>
              </CardTitle>
              <CardDescription>
                Request a new meter account for existing meter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMeterAccountSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meterName">Full Name *</Label>
                    <Input
                      id="meterName"
                      value={meterAccountForm.name}
                      onChange={(e) => setMeterAccountForm({...meterAccountForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meterEmail">Email Address *</Label>
                    <Input
                      id="meterEmail"
                      type="email"
                      value={meterAccountForm.email}
                      onChange={(e) => setMeterAccountForm({...meterAccountForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meterPhone">Phone Number *</Label>
                    <Input
                      id="meterPhone"
                      value={meterAccountForm.phone}
                      onChange={(e) => setMeterAccountForm({...meterAccountForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="premiseUse">Premise Use</Label>
                    <Select 
                      value={meterAccountForm.premiseUse} 
                      onValueChange={(value) => setMeterAccountForm({...meterAccountForm, premiseUse: value})}
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
                      value={meterAccountForm.typeofMeter} 
                      onValueChange={(value) => setMeterAccountForm({...meterAccountForm, typeofMeter: value as 'SINGLE_PHASE' | 'THREE_PHASE'})}
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
                      value={meterAccountForm.typeofHouse} 
                      onValueChange={(value) => setMeterAccountForm({...meterAccountForm, typeofHouse: value})}
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
                      value={meterAccountForm.electricityProvider}
                      onChange={(e) => setMeterAccountForm({...meterAccountForm, electricityProvider: e.target.value})}
                      placeholder="e.g., EKEDC, IKEDC, PHED"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lga">Local Government Area (LGA)</Label>
                    <Input
                      id="lga"
                      value={meterAccountForm.lga}
                      onChange={(e) => setMeterAccountForm({...meterAccountForm, lga: e.target.value})}
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
                        value={meterAccountForm.address.street}
                        onChange={(e) => setMeterAccountForm({
                          ...meterAccountForm, 
                          address: {...meterAccountForm.address, street: e.target.value}
                        })}
                        required
                        placeholder="Enter street address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="addressCity">City *</Label>
                      <Input
                        id="addressCity"
                        value={meterAccountForm.address.city}
                        onChange={(e) => setMeterAccountForm({
                          ...meterAccountForm, 
                          address: {...meterAccountForm.address, city: e.target.value}
                        })}
                        required
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="addressState">State *</Label>
                      <Input
                        id="addressState"
                        value={meterAccountForm.address.state}
                        onChange={(e) => setMeterAccountForm({
                          ...meterAccountForm, 
                          address: {...meterAccountForm.address, state: e.target.value}
                        })}
                        required
                        placeholder="Enter state"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="addressCountry">Country *</Label>
                      <Input
                        id="addressCountry"
                        value={meterAccountForm.address.country}
                        onChange={(e) => setMeterAccountForm({
                          ...meterAccountForm, 
                          address: {...meterAccountForm.address, country: e.target.value}
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
                      checked={meterAccountForm.houseOwner}
                      onCheckedChange={(checked) => 
                        setMeterAccountForm({...meterAccountForm, houseOwner: checked as boolean})
                      }
                    />
                    <Label htmlFor="houseOwner">I am the house owner</Label>
                  </div>
                  
                  {!meterAccountForm.houseOwner && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="landlordName">Landlord Name</Label>
                        <Input
                          id="landlordName"
                          value={meterAccountForm.landlordName}
                          onChange={(e) => setMeterAccountForm({...meterAccountForm, landlordName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="landlordPhone">Landlord Phone</Label>
                        <Input
                          id="landlordPhone"
                          value={meterAccountForm.landlordPhone}
                          onChange={(e) => setMeterAccountForm({...meterAccountForm, landlordPhone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="landlordAddress">Landlord Address</Label>
                        <Input
                          id="landlordAddress"
                          value={meterAccountForm.landlordAddress}
                          onChange={(e) => setMeterAccountForm({...meterAccountForm, landlordAddress: e.target.value})}
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
                        value={meterAccountForm.meansOfIdentification} 
                        onValueChange={(value) => setMeterAccountForm({...meterAccountForm, meansOfIdentification: value})}
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
                        value={meterAccountForm.identificationNumber}
                        onChange={(e) => setMeterAccountForm({...meterAccountForm, identificationNumber: e.target.value})}
                        required
                        placeholder="Enter your identification number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landMark">Landmark (Optional)</Label>
                    <Input
                      id="landMark"
                      value={meterAccountForm.landMark}
                      onChange={(e) => setMeterAccountForm({...meterAccountForm, landMark: e.target.value})}
                      placeholder="Enter nearby landmark for easy identification"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Meter Account Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {/* Meter Account Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Meter Account Applications</span>
              </CardTitle>
              <CardDescription>
                Track your meter account applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(userMeterApplications?.data) && userMeterApplications?.data?.length > 0 ? (
                  userMeterApplications?.data?.map((app: any) => (
                    console.log('app', app),
                  <div
                      key={app._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Gauge className="w-5 h-5 text-blue-600" />
                      </div>
                      
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium truncate">Meter Account Application</span>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {app.name} • {app.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.address ? `${app.address.street}, ${app.address.city}` : 'N/A'} • 
                            Submitted: {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className="text-xs text-gray-500">ID: {app._id.slice(-8)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(app._id, 'meter-account')}
                          >
                            View
                          </Button>
                          {app.status === 'PENDING' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditApplication(app._id, 'meter-account')}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteApplication(app._id, 'meter-account')}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Gauge className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Meter Account Applications</h3>
                    <p className="text-gray-600 mb-4">You haven't submitted any meter account applications yet.</p>
                    <Button 
                      onClick={() => setActiveTab('meter-account')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Create Meter Account Application
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* New Meter Application Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">New Meter Requests</span>
              </CardTitle>
              <CardDescription>
                Track your new meter installation requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(userMeterApplicationRequests?.data) && userMeterApplicationRequests?.data?.length > 0 ? (
                  userMeterApplicationRequests?.data?.map((app: any) => (
                    <div
                      key={app._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-green-600" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium truncate">New Meter Request</span>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                          </Badge>
                        </div>
                          <p className="text-sm text-gray-600 truncate">
                            {app.name} • {app.email}
                          </p>
                        <p className="text-xs text-gray-500">
                            {app.address ? `${app.address.street}, ${app.address.city}` : 'N/A'} • 
                            Submitted: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                      <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className="text-xs text-gray-500">ID: {app._id.slice(-8)}</span>
                    </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(app._id, 'new-meter')}
                          >
                            View
                          </Button>
                          {app.status === 'PENDING' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditApplication(app._id, 'new-meter')}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteApplication(app._id, 'new-meter')}
                          >
                            Delete
                          </Button>
                  </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No New Meter Requests</h3>
                    <p className="text-gray-600 mb-4">You haven't submitted any new meter requests yet.</p>
                    <Button 
                      onClick={() => setActiveTab('new-meter')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Create New Meter Request
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}