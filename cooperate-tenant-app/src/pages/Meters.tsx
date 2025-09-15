import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useGetUserMeterAccountApplicationsQuery, useGetUserMeterApplicationRequestsQuery, useDeleteMeterAccountApplicationMutation, useDeleteMeterApplicationRequestMutation } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// Import the new components
import NewMeterForm from '../components/forms/NewMeterForm';
import MeterAccountForm from '../components/forms/MeterAccontForm';
import MyApplications from '../components/tabs/MyApplications';
import ApplicationDetailsModal from '../components/modals/ApplicationDetailsModal';

export function MetersPage() {
  const { user } = useAuth();
  const userId = user?._id || '';
  const cooperateId = user?.cooperateId || user?.cooperateId || '';
  const [activeTab, setActiveTab] = useState('new-meter');
  
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplicationType, setSelectedApplicationType] = useState<'meter-account' | 'new-meter' | null>(null);
  
  // Edit state management
  const [editData, setEditData] = useState<any>(null);
  const [editApplicationType, setEditApplicationType] = useState<'meter-account' | 'new-meter' | null>(null);
  
  // API hooks
  const {data: userMeterApplications} = useGetUserMeterAccountApplicationsQuery({id: userId})
  const {data: userMeterApplicationRequests} = useGetUserMeterApplicationRequestsQuery({id: userId})
  
  // Mutation hooks
  const [deleteMeterAccountApplication] = useDeleteMeterAccountApplicationMutation()
  const [deleteMeterApplicationRequest] = useDeleteMeterApplicationRequestMutation()

  // CRUD handlers for applications
  const handleViewApplication = (applicationId: string, applicationType: 'meter-account' | 'new-meter') => {
    setSelectedApplicationId(applicationId);
    setSelectedApplicationType(applicationType);
    setIsModalOpen(true);
  };

  const handleEditApplication = (applicationId: string, applicationType: 'meter-account' | 'new-meter') => {
    
    
    let application;
    if (applicationType === 'meter-account') {
      application = userMeterApplications?.data?.find((app: any) => app._id === applicationId);
    } else {
      application = userMeterApplicationRequests?.data?.find((app: any) => app._id === applicationId);
    }
    
    
    
    if (application) {
      setEditData(application);
      setEditApplicationType(applicationType);
      
      // Switch to the appropriate tab for editing
      if (applicationType === 'meter-account') {
        setActiveTab('meter-account');
      } else {
        setActiveTab('new-meter');
      }
      
      toast.success(`Editing ${applicationType === 'meter-account' ? 'Meter Account' : 'New Meter'} application`);
    } else {
      
      toast.error('Application not found');
    }
  };

  const handleEditComplete = () => {
    setEditData(null);
    setEditApplicationType(null);
    toast.success('Application updated successfully!');
  };

  const handleDeleteApplication = async (applicationId: string, applicationType: 'meter-account' | 'new-meter') => {
    const applicationTypeName = applicationType === 'meter-account' ? 'Meter Account' : 'New Meter';
    
    if (window.confirm(`Are you sure you want to delete this ${applicationTypeName} application?`)) {
      try {
        toast.loading('Deleting application...');
        
        if (applicationType === 'meter-account') {
          await deleteMeterAccountApplication({ id: applicationId }).unwrap();
        } else {
          await deleteMeterApplicationRequest({ id: applicationId }).unwrap();
        }
        
        toast.dismiss();
        toast.success(`${applicationTypeName} application deleted successfully`);
      } catch (error: any) {
        toast.dismiss();
        toast.error(error?.data?.message || 'Failed to delete application');
      
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

        <TabsContent value="new-meter" className="space-y-4">
          <NewMeterForm 
            userId={userId} 
            cooperateId={cooperateId}
            editData={editApplicationType === 'new-meter' ? editData : null}
            onEditComplete={handleEditComplete}
          />
        </TabsContent>

        <TabsContent value="meter-account" className="space-y-4">
          <MeterAccountForm 
            userId={userId} 
            cooperateId={cooperateId}
            editData={editApplicationType === 'meter-account' ? editData : null}
            onEditComplete={handleEditComplete}
          />
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <MyApplications
            userMeterApplications={userMeterApplications}
            userMeterApplicationRequests={userMeterApplicationRequests}
            onViewApplication={handleViewApplication}
            onEditApplication={handleEditApplication}
            onDeleteApplication={handleDeleteApplication}
            onSwitchTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicationId={selectedApplicationId}
        applicationType={selectedApplicationType}
      />
    </div>
  );
}