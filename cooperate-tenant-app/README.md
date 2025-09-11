# Energy Cooperative Frontend

A modern React application for managing energy cooperative operations, built with TypeScript, Vite, and Redux Toolkit Query.

## 🚀 Features

- **User Authentication**: Complete authentication flow with registration, login, OTP verification, and password reset
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI components
- **State Management**: Redux Toolkit Query for efficient API state management
- **Type Safety**: Full TypeScript support for better development experience
- **Routing**: React Router for seamless navigation
- **Toast Notifications**: User-friendly notifications with react-hot-toast

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Language**: TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **State Management**: Redux Toolkit Query
- **Routing**: React Router DOM
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── api/                 # API configuration and endpoints
│   └── api.ts          # RTK Query API setup
├── components/         # Reusable UI components
│   └── ui/            # Base UI components (Button, Input, Card, etc.)
├── config/            # Application configuration
├── context/           # React Context providers
│   └── AuthContext.tsx # Authentication context
├── interface/         # TypeScript type definitions
│   └── auth.ts        # Authentication interfaces
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── VerifyOTP.tsx
│   │   └── ResendOtpPage.tsx
│   └── Home/          # Main application pages
├── store/             # Redux store configuration
│   └── store.ts       # Store setup
├── styles/            # Global styles
├── App.tsx            # Main application component
├── Layout.tsx         # Application layout
└── main.tsx           # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cooperate-frontend/cooperate-tenant-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api/v1
   VITE_FRONTEND_URL=http://localhost:5173
   VITE_LOCAL_BACKEND_URL=http://localhost:5000/api/v1
   VITE_BACKEND_LIVE_URL=https://your-backend-url.com/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. **Registration**: Users can register with email, password, name, and phone
2. **Email Verification**: OTP sent to email for verification
3. **Login**: Authenticated users can log in
4. **OTP Resend**: Users can request new OTP if needed
5. **Password Reset**: Forgot password functionality (placeholder)

## 🌐 API Integration

The application uses Redux Toolkit Query for API management with the following endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify` - OTP verification
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/refresh` - Token refresh

## 🎨 UI Components

Built with a custom design system using:
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Custom components** for specific needs

## 🔒 Security Features

- JWT token management
- Automatic token refresh
- Protected routes
- Input validation
- Error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Environment Variables for Production

Make sure to set the correct environment variables for your production environment:

```env
VITE_BACKEND_URL=https://your-production-backend.com/api/v1
VITE_FRONTEND_URL=https://your-production-frontend.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with authentication flow
- **v1.1.0** - Added OTP verification and resend functionality
- **v1.2.0** - Enhanced UI/UX and error handling

---

Built with ❤️ for Energy Cooperative Management
