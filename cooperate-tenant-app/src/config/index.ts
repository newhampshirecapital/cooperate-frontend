export const config = {
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'https://cooperative-tenant-1.onrender.com/api/v1',
    frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
    localBackendUrl: import.meta.env.VITE_LOCAL_BACKEND_URL || 'http://localhost:5000/api/v1',
    backendLiveUrl: import.meta.env.VITE_BACKEND_LIVE_URL || 'https://kodekitchen-backend.onrender.com/api',
  

    paystackSecretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY || 'sk_test_83959a91461ee2991a85c19f62faf5b029a3af85',
    paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_85d208d2ca0e7d0ab79573bda2cc9542054d3980',
  };