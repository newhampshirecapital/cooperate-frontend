import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  MessageSquare, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCreateComplaintMutation, useGetComplaintByIdQuery, useGetComplaintsQuery } from '../api/api';

export function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('new-complaint');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const [createComplaint, { isLoading: isCreatingComplaint }] = useCreateComplaintMutation();
  
  const userId = user?._id || '';
  const cooperativeId = user?.cooperativeId || '';
  const userPhone = user?.phone ||'';
  
  const { data: complaintsData, isLoading: isGettingComplaints, refetch: refetchComplaints } = useGetComplaintsQuery(
    { id: userId },
    { skip: !userId }
  );
  
  const { data: complaintDetails, isLoading: isGettingComplaintById } = useGetComplaintByIdQuery(
    { id: selectedComplaintId || '' },
    { skip: !selectedComplaintId }
  );
  
  const existingComplaints = complaintsData?.data || [];
  
  const [complaintForm, setComplaintForm] = useState({
    userId: userId,
    cooperativeId: cooperativeId || '',
    name: user?.name || '',
    phone:userPhone || '',
    message: '',
    subject: '',
    category: '',
    priority: '',
    description: '',
    contactMethod: '',
    contactNumber:'',
  });

 

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintForm.subject || !complaintForm.category || !complaintForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    await createComplaint(complaintForm);
    toast.loading('Submitting Request...');
    

    setTimeout(() => {
      toast.dismiss();
      toast.success('Complaint submitted successfully! You will receive a confirmation email.');
      setComplaintForm({
        subject: '',
        category: '',
        priority: '',
        description: '',
        contactNumber:'',
        contactMethod: '',
        userId: userId,
        phone:userPhone,
        cooperativeId: cooperativeId || '',
        name: user?.name || '',
        message: '',
      });
      // Refetch complaints to show the new complaint
      refetchComplaints();
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaintId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Complaints & Support</h2>
          <p className="text-gray-600">Submit complaints and track their resolution status</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-complaint">Submit Complaint</TabsTrigger>
          <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
        </TabsList>

        <TabsContent value="new-complaint" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Submit New Complaint
                  </CardTitle>
                  <CardDescription>
                    Report an issue or concern to our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComplaint} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={complaintForm.subject}
                        onChange={(e) => setComplaintForm({...complaintForm, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                          value={complaintForm.category} 
                          onValueChange={(value) => setComplaintForm({...complaintForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical">Technical Issues</SelectItem>
                            <SelectItem value="Billing">Billing & Payment</SelectItem>
                            <SelectItem value="Service">Service Quality</SelectItem>
                            <SelectItem value="Meter">Meter Issues</SelectItem>
                            <SelectItem value="Application">Application Issues</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={complaintForm.priority} 
                          onValueChange={(value) => setComplaintForm({...complaintForm, priority: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number (so we can reach you)</Label>
                          <Input
                            id="contactNumber"
                            placeholder="Enter your contact number"
                            value={complaintForm.contactNumber}
                            onChange={(e) => setComplaintForm({...complaintForm, contactNumber: e.target.value})}
                          />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                        <Select 
                          value={complaintForm.contactMethod} 
                          onValueChange={(value) => setComplaintForm({...complaintForm, contactMethod: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How should we contact you?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Phone">Phone Call</SelectItem>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="App">App Notification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about your issue..."
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isCreatingComplaint}>
                      <Send className="w-4 h-4 mr-2" />
                      {isCreatingComplaint ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Common Issues:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Meter reading problems</li>
                      <li>• Billing discrepancies</li>
                      <li>• Power outages</li>
                      <li>• Token purchase issues</li>
                      <li>• Application status queries</li>
                    </ul>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-medium mb-2 text-sm">Response Times:</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Urgent:</span>
                        <span>2-4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>High:</span>
                        <span>24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium:</span>
                        <span>2-3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Low:</span>
                        <span>5-7 days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      For urgent technical issues or power emergencies:
                    </p>
                    <div className="font-medium">
                      📞 Emergency Hotline:<br />
                      <span className="text-primary">+234-800-POWER-1</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Available 24/7 for critical issues
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Complaints
              </CardTitle>
              <CardDescription>
                Track the status and responses to your submitted complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGettingComplaints ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading complaints...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {existingComplaints.map((complaint: any) => (
                  <div
                    key={complaint.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{complaint.subject}</h4>
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status.replace('-', ' ').charAt(0).toUpperCase() + 
                             complaint.status.replace('-', ' ').slice(1)}
                          </Badge>
                          <Badge className={getPriorityColor(complaint.priority)} variant="outline">
                            {complaint.priority}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Category:</strong> {complaint.category}</p>
                          <p><strong>Submitted:</strong> {complaint.createdAt.split('T')[0]}</p>
                          <p><strong>Last Update:</strong> {complaint.updatedAt.split('T')[0]}</p>
                          <p><strong>ID:</strong> {complaint._id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Issue Description:</h5>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {complaint.description}
                        </p>
                      </div>
                      
                      {complaint.response && (
                        <div>
                          <h5 className="font-medium text-sm mb-1">Admin Response:</h5>
                          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border-l-4 border-blue-200">
                            {complaint.response}
                          </p>
                        </div>
                      )}
                      
                      {!complaint.response && complaint.status === 'open' && (
                        <p className="text-sm text-gray-500 italic">
                          Waiting for admin response...
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => viewComplaint(complaint._id)}>
                        View Details
                      </Button>
                      {complaint.status === 'resolved' && (
                        <Button variant="outline" size="sm">
                          Provide Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                  {existingComplaints.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No complaints submitted yet.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('new-complaint')}
                        className="mt-2"
                      >
                        Submit Your First Complaint
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Complaint Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Complaint Details</h3>
              <Button variant="outline" size="sm" onClick={closeModal}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            
            {isGettingComplaintById ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-gray-500">Loading complaint details...</p>
              </div>
            ) : complaintDetails?.data ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Subject</Label>
                    <p className="text-sm">{complaintDetails.data.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <p className="text-sm">{complaintDetails.data.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Priority</Label>
                    <Badge className={getPriorityColor(complaintDetails.data.priority)}>
                      {complaintDetails.data.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge className={getStatusColor(complaintDetails.data.status)}>
                      {complaintDetails.data.status.replace('-', ' ').charAt(0).toUpperCase() + 
                       complaintDetails.data.status.replace('-', ' ').slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Submitted Date</Label>
                    <p className="text-sm">{complaintDetails.data.createdAt?.split('T')[0]}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                    <p className="text-sm">{complaintDetails.data.updatedAt?.split('T')[0]}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Complaint ID</Label>
                    <p className="text-sm font-mono">{complaintDetails.data._id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Number</Label>
                    <p className="text-sm">{complaintDetails.data.contactNumber || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{complaintDetails.data.description}</p>
                  </div>
                </div>
                
                {complaintDetails.data.response && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Admin Response</Label>
                    <div className="mt-1 p-3 bg-blue-50 rounded-md border-l-4 border-blue-200">
                      <p className="text-sm">{complaintDetails.data.response}</p>
                    </div>
                  </div>
                )}
                
                {complaintDetails.data.responseDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Response Date</Label>
                    <p className="text-sm">{complaintDetails.data.responseDate.split('T')[0]}</p>
                  </div>
                )}
                
                {!complaintDetails.data.response && complaintDetails.data.status === 'open' && (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Waiting for admin response...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-gray-500">Failed to load complaint details</p>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}