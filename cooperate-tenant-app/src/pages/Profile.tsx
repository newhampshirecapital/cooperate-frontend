import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit,
  Save,
  X,
  Shield,
  Zap,
  Home as HomeIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetUserQuery, useUpdateUserMutation } from '../api/api';
import type { Address } from '../interface/auth';
import { PasswordChangeModal } from '../components/modal/PasswordChangeModal';

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role?: 'admin' | 'member';
    bio?: string;
    address: Address;
}

export function ProfilePage() {
    const [isAddressSet, setIsAddressSet] = useState(false);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    const [updateUserMutation, ] = useUpdateUserMutation()
  const {data: user, refetch} = useGetUserQuery()
  const userData = user?.data as User
 
  useEffect(() => {
    if (userData?.address?.street && userData.address.street.length > 0) {
      setIsAddressSet(true);
    } else {
      setIsAddressSet(false);
    }
  }, [userData?.address])


  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    bio: 'Passionate about renewable energy and sustainable living.',
    energyGoal: '500',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

 
   
  

  const handleSave = () => {
    if (!userData?._id) {
      toast.error('User ID not found!');
      return;
    }
    
    updateUserMutation({ 
      id: userData._id, 
      payload: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }
    }).unwrap().then(() => {
      toast.success('Profile updated successfully!');
      refetch();
    setIsEditing(false);
    }).catch((error: any) => {
      toast.error(error?.data?.message || 'Failed to update profile!');
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zip: ''
      },
      bio: 'Passionate about renewable energy and sustainable living.',
      energyGoal: '500',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    });
  };

  const energyStats = [
    { label: 'Energy Generated', value: '2,847 kWh', icon: Zap, color: 'text-green-600' },
    { label: 'Energy Consumed', value: '1,923 kWh', icon: HomeIcon, color: 'text-blue-600' },
    { label: 'Net Production', value: '924 kWh', icon: Zap, color: 'text-purple-600' }
  ];

  const handlePasswordChange = () => {
    setShowPasswordChangeModal(true);
  }
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

       {!isAddressSet ? (
         <div className="w-full bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
           <div className="flex items-center gap-2">
             <MapPin className="w-5 h-5 text-yellow-600" />
             <div>
               <p className="text-sm font-medium text-yellow-800">Address Not Set</p>
               <p className="text-xs text-yellow-700">Please set your address to continue using the platform</p>
             </div>
           </div>
         </div>
       ) : null}

   

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {userData?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{userData?.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {userData?.role === 'admin' ? 'Administrator' : 'Member'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{userData?.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{userData?.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{userData?.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{userData?.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  {isEditing ? (
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, street: e.target.value}
                      })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userData?.address?.street}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, city: e.target.value}
                      })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userData?.address?.city}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, state: e.target.value}
                      })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userData?.address?.state}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip">Country</Label>
                  {isEditing ? (
                    <Input
                      id="zip"
                      value={formData.address.country}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, country: e.target.value}
                      })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userData?.address?.country}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                ) : (
                  <p className="p-2 text-gray-700">{userData?.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Energy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Preferences</CardTitle>
              <CardDescription>
                Configure your energy trading and usage settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="energyGoal">Monthly Energy Goal (kWh)</Label>
                {isEditing ? (
                  <Input
                    id="energyGoal"
                    type="number"
                    value={formData.energyGoal}
                    onChange={(e) => setFormData({...formData, energyGoal: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <span>{formData.energyGoal} kWh</span>
                  </div>
                )}
              </div>
              
              {userData?.role === 'admin' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Admin Settings</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    As an administrator, you have access to additional cooperative management features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Energy Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Overview</CardTitle>
              <CardDescription>Your current energy statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {energyStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account verification and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Type</span>
                <Badge variant="secondary">
                  {userData?.role === 'admin' ? 'Administrator' : 'Member'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="text-sm text-gray-600">Jan 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handlePasswordChange}>
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <PasswordChangeModal 
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
        userId={userData?._id || ''}
      />
    </div>
  );
}