import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Gauge, 
  Zap, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  FileCheck,
  Loader2
} from 'lucide-react';
import { useGetMeterAccountApplicationByIdQuery, useGetMeterApplicationRequestByIdQuery } from '../../api/api';

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
  applicationType: 'meter-account' | 'new-meter' | null;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  applicationType
}) => {
  // Use the appropriate API hook based on application type
  const { data: meterAccountData, isLoading: isLoadingMeterAccount, error: meterAccountError } = 
    useGetMeterAccountApplicationByIdQuery(
      { id: applicationId || '' },
      { skip: !applicationId || applicationType !== 'meter-account' }
    );

  const { data: meterRequestData, isLoading: isLoadingMeterRequest, error: meterRequestError } = 
    useGetMeterApplicationRequestByIdQuery(
      { id: applicationId || '' },
      { skip: !applicationId || applicationType !== 'new-meter' }
    );

  // Get the application data based on type
  const applicationData = applicationType === 'meter-account' 
    ? meterAccountData?.data 
    : meterRequestData?.data;

  const isLoading = applicationType === 'meter-account' 
    ? isLoadingMeterAccount 
    : isLoadingMeterRequest;

  const error = applicationType === 'meter-account' 
    ? meterAccountError 
    : meterRequestError;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {applicationType === 'meter-account' ? (
              <Gauge className="w-5 h-5 text-blue-600" />
            ) : (
              <Zap className="w-5 h-5 text-green-600" />
            )}
            {applicationType === 'meter-account' ? 'Meter Account Application' : 'New Meter Request'} Details
          </DialogTitle>
          <DialogDescription>
            Complete application information and status
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading application details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Failed to load application details</div>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        ) : applicationData ? (
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {applicationType === 'meter-account' ? (
                    <Gauge className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Zap className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{applicationData.name}</h3>
                  <p className="text-sm text-gray-600">{applicationData.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Badge className={getStatusColor(applicationData.status)}>
                  {applicationData.status?.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <p className="text-sm">{applicationData.name || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <p className="text-sm">{applicationData.email || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <p className="text-sm">{applicationData.phone || 'N/A'}</p>
                </div>
                {applicationData.nin && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">NIN</Label>
                    <p className="text-sm">{applicationData.nin}</p>
                  </div>
                )}
                {applicationData.occupation && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Occupation</Label>
                    <p className="text-sm">{applicationData.occupation}</p>
                  </div>
                )}
                {applicationData.lga && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">LGA</Label>
                    <p className="text-sm">{applicationData.lga}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {applicationData.address && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Street Address</Label>
                    <p className="text-sm">{applicationData.address.street || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">City</Label>
                    <p className="text-sm">{applicationData.address.city || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">State</Label>
                    <p className="text-sm">{applicationData.address.state || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Country</Label>
                    <p className="text-sm">{applicationData.address.country || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Application Specific Information */}
            {applicationType === 'meter-account' ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Meter Account Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applicationData.premiseUse && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Premise Use</Label>
                      <p className="text-sm">{applicationData.premiseUse}</p>
                    </div>
                  )}
                  {applicationData.typeofMeter && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Meter Type</Label>
                      <p className="text-sm">{applicationData.typeofMeter}</p>
                    </div>
                  )}
                  {applicationData.typeofHouse && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">House Type</Label>
                      <p className="text-sm">{applicationData.typeofHouse}</p>
                    </div>
                  )}
                  {applicationData.electricityProvider && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Electricity Provider</Label>
                      <p className="text-sm">{applicationData.electricityProvider}</p>
                    </div>
                  )}
                  {applicationData.meansOfIdentification && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Means of Identification</Label>
                      <p className="text-sm">{applicationData.meansOfIdentification}</p>
                    </div>
                  )}
                  {applicationData.identificationNumber && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Identification Number</Label>
                      <p className="text-sm">{applicationData.identificationNumber}</p>
                    </div>
                  )}
                  {applicationData.landMark && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Landmark</Label>
                      <p className="text-sm">{applicationData.landMark}</p>
                    </div>
                  )}
                  {applicationData.isHouseOwner !== undefined && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">House Owner</Label>
                      <p className="text-sm">{applicationData.isHouseOwner ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                </div>

                {/* Landlord Information */}
                {!applicationData.isHouseOwner && (applicationData.landlordName || applicationData.landlordPhone || applicationData.landlordAddress) && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Landlord Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {applicationData.landlordName && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Landlord Name</Label>
                          <p className="text-sm">{applicationData.landlordName}</p>
                        </div>
                      )}
                      {applicationData.landlordPhone && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Landlord Phone</Label>
                          <p className="text-sm">{applicationData.landlordPhone}</p>
                        </div>
                      )}
                      {applicationData.landlordAddress && (
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-gray-700">Landlord Address</Label>
                          <p className="text-sm">{applicationData.landlordAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  New Meter Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applicationData.userType && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">User Type</Label>
                      <p className="text-sm">{applicationData.userType}</p>
                    </div>
                  )}
                  {applicationData.tariffBand && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Tariff Band</Label>
                      <p className="text-sm">{applicationData.tariffBand}</p>
                    </div>
                  )}
                  {applicationData.electricityBusinessUnit && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Electricity Business Unit</Label>
                      <p className="text-sm">{applicationData.electricityBusinessUnit}</p>
                    </div>
                  )}
                  {applicationData.loadSeperation !== undefined && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Load Separation</Label>
                      <p className="text-sm">{applicationData.loadSeperation ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                {(applicationData.accountName || applicationData.accountNumber || applicationData.accountPhoneNumber) && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Account Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {applicationData.accountName && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Account Name</Label>
                          <p className="text-sm">{applicationData.accountName}</p>
                        </div>
                      )}
                      {applicationData.accountNumber && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Account Number</Label>
                          <p className="text-sm">{applicationData.accountNumber}</p>
                        </div>
                      )}
                      {applicationData.accountPhoneNumber && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Account Phone Number</Label>
                          <p className="text-sm">{applicationData.accountPhoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Information */}
            {applicationData.moreInfo && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Additional Information</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{applicationData.moreInfo}</p>
                </div>
              </div>
            )}

            {/* Application Metadata */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Application Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Application ID</Label>
                  <p className="text-sm font-mono">{applicationData._id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Submitted Date</Label>
                  <p className="text-sm">{new Date(applicationData.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                  <p className="text-sm">{new Date(applicationData.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={getStatusColor(applicationData.status)}>
                    {applicationData.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No application data available.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsModal;
