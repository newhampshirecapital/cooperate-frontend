import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { useGetAllpendingInvitesQuery, useUpdateUserInviteStatusMutation } from '../../api/api'
import { useAuth } from '../../context/AuthContext'

interface PendingInvite {
  _id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    country: string
  }
  type: string
  occupation: string
  referralSource: string
  status: string
  cooperativeId: string
  createdAt: string
  updatedAt: string
}

const PendingInvites = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedInviteId, setSelectedInviteId] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [isLoadingAccept, setIsLoadingAccept] = useState(false)
  const [isLoadingReject, setIsLoadingReject] = useState(false)
  
  const { data: pendingInvites, isLoading, error, refetch } = useGetAllpendingInvitesQuery({
    id: user?.cooperateId || ''
  })

  const [updateUserInviteStatus] = useUpdateUserInviteStatusMutation()

  const handleApprove = async (inviteId: string) => {
    try {
      setIsLoadingAccept(true)
      await updateUserInviteStatus({
        status: 'approved' as any,
        adminId: user?._id || '',
        inviteId: inviteId
      }).unwrap()

      
      toast.success('Invite approved successfully!')
      refetch()
    } catch (error) {
      console.error('Error approving invite:', error)
      toast.error('Failed to approve invite')
    }
    finally {
      setIsLoadingAccept(false)
    }
  }

  const handleReject = async (inviteId: string) => {
    setSelectedInviteId(inviteId)
    setRejectModalOpen(true)
  }

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      setIsLoadingReject(true)
      await updateUserInviteStatus({
        status: 'rejected' as any,
        adminId: user?._id as string,
        inviteId: selectedInviteId,
        declineReason: rejectReason
      }).unwrap()
      
      toast.success('Invite rejected successfully!')
      setRejectModalOpen(false)
      setRejectReason('')
      setSelectedInviteId('')
      refetch()
    } catch (error) {
      console.error('Error rejecting invite:', error)
      toast.error('Failed to reject invite')
    }
    finally {
      setIsLoadingReject(false)
    }
  }

  const cancelReject = () => {
    setRejectModalOpen(false)
    setRejectReason('')
    setSelectedInviteId('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'individual':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700"><User className="w-3 h-3 mr-1" />Individual</Badge>
      case 'business':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700"><Briefcase className="w-3 h-3 mr-1" />Business</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredInvites = pendingInvites?.data?.filter((invite: PendingInvite) => {
    const matchesSearch = invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invite.phone.includes(searchTerm)
    
    const matchesStatus = filterStatus === 'all' || invite.status === filterStatus
    const matchesType = filterType === 'all' || invite.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  }) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading pending invites...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error loading pending invites</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 m-3 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Invites</h1>
          <p className="text-gray-600">Manage membership requests and invitations</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {pendingInvites?.data?.length || 0} total invites
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    setFilterStatus('all')
                    setFilterType('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invites List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInvites.map((invite: PendingInvite) => (
          <Card key={invite._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{invite.name}</CardTitle>
                    <CardDescription>{invite.email}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(invite.status)}
                  {getTypeBadge(invite.type)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{invite.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{invite.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
    <div>
                    <div>{invite.address.street}</div>
                    <div>{invite.address.city}, {invite.address.state}</div>
                    <div>{invite.address.country}</div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Occupation:</span>
                  <span>{invite.occupation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Applied:</span>
                  <span>{formatDate(invite.createdAt)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Referral Source:</span>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {invite.referralSource}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              {invite.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleApprove(invite._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isLoadingAccept ? <Loader2 className="w-4 h-4 mr-2" /> : 'Approve'}
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleReject(invite._id)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {isLoadingReject ? <Loader2 className="w-4 h-4 mr-2" /> : 'Reject'}
                    
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredInvites.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invites found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your filters to see more results.'
                : 'No pending invites at the moment.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Invite</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this membership request. This will help the applicant understand why their request was declined.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reject-reason" className="text-sm font-medium">
                Reason for Rejection *
              </label>
              <Textarea
                id="reject-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelReject}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PendingInvites
