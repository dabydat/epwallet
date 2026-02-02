import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { JSX } from 'react';
import { UserProvider, useUser } from '@modules/client/context/UserContext';
import { Layout } from '@shared/components/Layout';
import { IdentificationScreen } from '@modules/client/pages/IdentificationScreen';
import { DashboardScreen } from '@modules/wallet/pages/DashboardScreen';

// Guard for protected routes
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

import { LogOut } from 'lucide-react';

function AppContent() {
  const { user, logout } = useUser();

  const headerActions = user ? (
    <button onClick={logout} className="p-2 hover:bg-indigo-700 rounded-full transition-colors text-white" title="Logout">
      <LogOut size={20} />
    </button>
  ) : null;

  return (
    <Layout headerActions={headerActions}>
      <Routes>
        <Route path="/" element={<IdentificationScreen />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
        <Toaster position="top-center" />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
