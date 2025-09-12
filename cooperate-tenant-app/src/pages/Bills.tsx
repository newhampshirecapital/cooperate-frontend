import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  CreditCard, 
  Zap, 
  History,
  Receipt,
  Plus,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

export function BillsPage() {
  const [selectedMeter, setSelectedMeter] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedElectricityCompany, setSelectedElectricityCompany] = useState('');
  const meterAccounts = [
    { id: '1', number: '20012345678', type: 'Prepaid', balance: '₦2,450.00', status: 'Active' },
    { id: '2', number: '20087654321', type: 'Postpaid', balance: '₦0.00', status: 'Active' }
  ];
  const electricityCompanies = [
    { id: '1', name: 'Eko Electricity' },
    { id: '2', name: 'Ikeja Electricity' },
    { id: '3', name: 'Lagos Electricity' }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      date: '2024-01-15',
      time: '14:30',
      amount: '₦5,000.00',
      units: '250 kWh',
      meter: '20012345678',
      status: 'Successful',
      reference: 'REF123456789'
    },
    {
      id: 'TXN002',
      date: '2024-01-10',
      time: '09:15',
      amount: '₦3,000.00',
      units: '150 kWh',
      meter: '20012345678',
      status: 'Successful',
      reference: 'REF987654321'
    },
    {
      id: 'TXN003',
      date: '2024-01-05',
      time: '16:45',
      amount: '₦2,000.00',
      units: '100 kWh',
      meter: '20087654321',
      status: 'Failed',
      reference: 'REF456789123'
    }
  ];

  const handlePurchaseToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMeter || !amount || !paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseInt(amount) < 100) {
      toast.error('Minimum purchase amount is ₦100');
      return;
    }

    // Simulate API call
    toast.loading('Processing payment...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Token purchased successfully!');
      setAmount('');
      setSelectedMeter('');
      setPaymentMethod('');
    }, 2000);
  };

  const handleQuickTopup = (quickAmount: string) => {
    setAmount(quickAmount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Bills & Payments</h2>
          <p className="text-gray-600">Purchase electricity tokens and manage your payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Token Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Purchase Electricity Token
              </CardTitle>
              <CardDescription>
                Buy electricity units for your meter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePurchaseToken} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="meter">Select Electricity Company</Label>
                  <Select value={selectedElectricityCompany} onValueChange={setSelectedElectricityCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a electricity company" />
                    </SelectTrigger>
                    <SelectContent>
                      {electricityCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meter">Select Meter Account</Label>
                  <Select value={selectedMeter} onValueChange={setSelectedMeter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a meter account" />
                    </SelectTrigger>
                    <SelectContent>
                      {meterAccounts.map((meter) => (
                        <SelectItem key={meter.id} value={meter.id}>
                          {meter.number} - {meter.type} (Balance: {meter.balance})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                  />
                  <div className="flex gap-2 mt-2">
                    {['1000', '2000', '5000', '10000'].map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTopup(quickAmount)}
                      >
                        ₦{quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Debit/Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="ussd">USSD</SelectItem>
                      <SelectItem value="wallet">Wallet Balance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {amount && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Transaction Summary</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>₦{amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Units:</span>
                        <span>{Math.round(parseInt(amount) / 20)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Fee:</span>
                        <span>₦50</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>₦{parseInt(amount) + 50}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Purchase Token
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Your recent electricity purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.status === 'Successful' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Receipt className={`w-5 h-5 ${
                          transaction.status === 'Successful' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{transaction.amount}</span>
                          <Badge 
                            variant={transaction.status === 'Successful' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Meter: {transaction.meter} • {transaction.units}
                        </p>
                        
                      <p className="text-xs text-gray-500">
                        Ref: {transaction.reference}
                      </p>
                    
                        <p className="text-xs text-gray-500">
                          {transaction.date} at {transaction.time}
                        </p>
                      </div>
                    </div>
                    
                    
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meter Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Your Meter Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meterAccounts.map((meter) => (
                <div key={meter.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{meter.number}</span>
                    <Badge variant="secondary">{meter.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Type: {meter.type}</p>
                    <p>Balance: {meter.balance}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Meter
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Check Meter Balance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Tariff Rates
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Having trouble with your purchase? Contact our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}