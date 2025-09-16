import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { TarfiiRate } from '../../constants/tariff'

interface TariffRatesModalProps {
  isOpen: boolean
  onClose: () => void
}

const TariffRatesModal = ({ isOpen, onClose }: TariffRatesModalProps) => {
  const tariffData = TarfiiRate[0] // Get the tariff data object

  const getBandColor = (band: string) => {
    switch (band) {
      case 'BAND A':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'BAND B':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'BAND C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BAND D':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'BAND E':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Electricity Tariff Rates</DialogTitle>
          <p className="text-gray-600">Current tariff rates for different customer bands</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(tariffData).map(([band, rates]) => (
            <Card key={band} className="overflow-hidden">
              <CardHeader className={`${getBandColor(band)} border-b`}>
                <CardTitle className="text-lg font-semibold">{band}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Minimum Supply Hours</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {rates['Mimimum supply of power (hrs)']} hrs
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Non-MD Tariff</div>
                    <div className="text-xl font-semibold text-green-600">
                      ₦{rates['Tariff N/KWh (Non MD)']}
                    </div>
                    <div className="text-xs text-gray-500">per kWh</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">MD 1 Tariff</div>
                    <div className="text-xl font-semibold text-purple-600">
                      ₦{rates['Tariff N/KWh (MD 1)']}
                    </div>
                    <div className="text-xs text-gray-500">per kWh</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">MD 2 Tariff</div>
                    <div className="text-xl font-semibold text-indigo-600">
                      ₦{rates['Tariff N/KWh (MD 2)']}
                    </div>
                    <div className="text-xs text-gray-500">per kWh</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Residential
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Commercial
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Industrial
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tariff rates are subject to change based on regulatory approvals</li>
            <li>• MD (Maximum Demand) tariffs apply to customers with higher consumption patterns</li>
            <li>• Minimum supply hours indicate guaranteed power availability</li>
            <li>• Rates are effective as of the current billing period</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TariffRatesModal
