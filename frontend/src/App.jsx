import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: {
              style: {
                background: '#E8F5E9',
                color: '#1B5E20',
                border: '1px solid #C8E6C9',
              },
              iconTheme: {
                primary: '#388E3C',
                secondary: '#E8F5E9',
              },
            },
            error: {
              style: {
                background: '#FFEBEE',
                color: '#D32F2F',
                border: '1px solid #FFCDD2',
              },
              iconTheme: {
                primary: '#D32F2F',
                secondary: '#FFEBEE',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
