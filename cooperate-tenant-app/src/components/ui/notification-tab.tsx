import { useState, useEffect } from 'react'
import { X, Bell } from 'lucide-react'
import { Button } from './button'

interface NotificationTabProps {
  message: string
  count: number
  onClose?: () => void
  autoHide?: boolean
  delay?: number
  duration?: number
}

const NotificationTab = ({ 
  message, 
  count, 
  onClose, 
  autoHide = true, 
  delay = 3000, 
  duration = 5000 
}: NotificationTabProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Show notification after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
      setIsAnimating(true)
    }, delay)

    // Auto hide after duration
    if (autoHide) {
      const hideTimer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, 300) // Wait for slide-out animation
      }, delay + duration)

      return () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }

    return () => clearTimeout(showTimer)
  }, [delay, duration, autoHide, onClose])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          bg-yellow-400 border border-yellow-500 rounded-lg shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        <div className="flex items-center gap-3 p-3 min-w-[280px]">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-yellow-800" />
              {count > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-900">{message}</p>
              <p className="text-xs text-yellow-700">
                {count} pending invite{count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-yellow-300 text-yellow-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Progress bar */}
        {autoHide && (
          <div className="h-1 bg-yellow-500 rounded-b-lg overflow-hidden">
            <div 
              className="h-full bg-yellow-600 transition-all ease-linear"
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

export default NotificationTab
