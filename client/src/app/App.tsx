import { TenantProvider, useTenant } from '../contexts/TenantContext';
import { LoginPage } from '../features/auth/LoginPage';
import { GlobalCommandDashboard } from '../features/dashboard/GlobalCommandDashboard';
import { GlobalAdminDashboard } from '../features/dashboard/GlobalAdminDashboard';
import { TenantAdminDashboard } from '../features/dashboard/TenantAdminDashboard';
import { SiteManagerDashboard } from '../features/dashboard/SiteManagerDashboard';

function AppRouter() {
  const { role, logout } = useTenant();

  if (!role) return <LoginPage />;

  return (
    <>
      {role === 'super-admin' && <GlobalCommandDashboard onLogout={logout} />}
      {role === 'global-admin' && <GlobalAdminDashboard onLogout={logout} />}
      {role === 'tenant-admin' && <TenantAdminDashboard onLogout={logout} />}
      {role === 'site-manager' && <SiteManagerDashboard onLogout={logout} />}
    </>
  );
}

function App() {
  return (
    <TenantProvider>
      <AppRouter />
    </TenantProvider>
  );
}

export default App;
