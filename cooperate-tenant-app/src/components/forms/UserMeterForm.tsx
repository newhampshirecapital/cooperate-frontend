import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { useCreateUserMeterMutation } from '../../api/api'

interface UserMeterFormProps {
  userId: string
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const UserMeterForm = ({ userId, isModalOpen, setIsModalOpen }: UserMeterFormProps) => {
  const [meterNumber, setMeterNumber] = useState('')
  const [meterType, setMeterType] = useState('')
  const [meterPhase, setMeterPhase] = useState('')
  
  const [createUserMeter, { isLoading }] = useCreateUserMeterMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!meterNumber || !meterType || !meterPhase) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const payload = {
        userId,
        meterNumber,
        meterType: meterType as any,
        meterPhase: meterPhase as any,
      }

      await createUserMeter(payload).unwrap()
      toast.success('Meter added successfully!')
      
      // Reset form
      setMeterNumber('')
      setMeterType('')
      setMeterPhase('')
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add meter')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Meter</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meterNumber">Meter Number</Label>
            <Input
              id="meterNumber"
              placeholder="Enter meter number"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meterType">Meter Type</Label>
            <Select value={meterType} onValueChange={setMeterType}>
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
            <Label htmlFor="meterPhase">Meter Phase</Label>
            <Select value={meterPhase} onValueChange={setMeterPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Select meter phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PREPAID">Prepaid</SelectItem>
                <SelectItem value="POSTPAID">Postpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Meter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserMeterForm
