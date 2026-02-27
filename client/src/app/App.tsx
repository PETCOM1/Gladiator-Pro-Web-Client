import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from '../contexts/TenantContext';
import { LoginPage } from '../features/auth/LoginPage';
import { InvitationPage } from '../features/auth/InvitationPage';
import { GlobalCommandDashboard } from '../features/dashboard/GlobalCommandDashboard';
import { GlobalAdminDashboard } from '../features/dashboard/GlobalAdminDashboard';
import { TenantAdminDashboard } from '../features/dashboard/TenantAdminDashboard';
import { SiteManagerDashboard } from '../features/dashboard/SiteManagerDashboard';

function AppRouter() {
  const { role, logout } = useTenant();

  if (!role) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invitation" element={<InvitationPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Tactical Role-Based Routing
  return (
    <Routes>
      <Route path="/" element={
        <>
          {role === 'SUPER_ADMIN' && <GlobalCommandDashboard onLogout={logout} />}
          {role === 'ADMIN' && <GlobalAdminDashboard onLogout={logout} />}
          {role === 'TENANT_OWNER' && <TenantAdminDashboard onLogout={logout} />}
          {role === 'SUPERVISOR' && <SiteManagerDashboard onLogout={logout} />}
          {!['SUPER_ADMIN', 'ADMIN', 'TENANT_OWNER', 'SUPERVISOR'].includes(role) && (
            <div className="min-h-screen bg-tactical-bg flex items-center justify-center p-8">
              <div className="max-w-md w-full bg-tactical-surface border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Access Denied</h2>
                <p className="text-tactical-muted text-sm mb-6">Your role ({role}) does not have access to the tactical command system. Please contact an administrator.</p>
                <button onClick={logout} className="w-full bg-brand-midnight border border-tactical-border text-tactical-muted font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:text-white transition-all">Sign Out</button>
              </div>
            </div>
          )}
        </>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <TenantProvider>
      <Router>
        <AppRouter />
      </Router>
    </TenantProvider>
  );
}

export default App;
