import { Provider } from 'react-redux';
import { Switch, Route, Redirect } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider'; // Assuming theme provider exists or will be created
import { store } from '@/store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient'; // Assuming queryClient setup exists

// Layout Components (assuming paths based on copied structure)
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import MobileNavigation from '@/components/layout/mobile-navigation';

// Pages (assuming paths based on copied structure)
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Profile from '@/pages/profile';
import Exercises from '@/pages/exercises';
import Programs from '@/pages/programs';
import Progress from '@/pages/progress';
import AiAssistant from '@/pages/ai-assistant';
import Avatar3D from '@/pages/avatar-3d'; // Assuming this page exists
import AdminDashboard from '@/pages/admin'; // Assuming this page exists
import NotFound from '@/pages/not-found';

// Placeholder for Auth Context/Hook (to be implemented with Firebase Auth)
// import { useAuth } from '@/hooks/useAuth';

function App() {
  // Placeholder for authentication state
  const isAuthenticated = false; // Replace with actual auth check later

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="flex min-h-screen bg-background">
            {isAuthenticated && <Sidebar />}
            <div className={`flex-1 flex flex-col ${isAuthenticated ? 'md:ml-64' : ''}`}>
              {isAuthenticated && <Topbar title="Nemfit" />}
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                <Switch>
                  {/* Public Routes */}
                  <Route path="/login">
                    {isAuthenticated ? <Redirect to="/" /> : <Login />}
                  </Route>
                  <Route path="/register">
                    {isAuthenticated ? <Redirect to="/" /> : <Register />}
                  </Route>

                  {/* Protected Routes */}
                  <Route path="/">
                    {isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/profile">
                    {isAuthenticated ? <Profile /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/exercises">
                    {isAuthenticated ? <Exercises /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/programs">
                    {isAuthenticated ? <Programs /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/progress">
                    {isAuthenticated ? <Progress /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/ai-assistant">
                    {isAuthenticated ? <AiAssistant /> : <Redirect to="/login" />}
                  </Route>
                   <Route path="/avatar-3d">
                    {isAuthenticated ? <Avatar3D /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/admin">
                     {/* Add admin role check later */}
                    {isAuthenticated ? <AdminDashboard /> : <Redirect to="/login" />}
                  </Route>

                  {/* Catch-all for 404 */}
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </main>
            </div>
            {isAuthenticated && <MobileNavigation />}
          </div>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

