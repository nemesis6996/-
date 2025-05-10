import { Provider } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'wouter'; // Aggiunto useLocation
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { store } from '@/store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Layout Components
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import MobileNavigation from '@/components/layout/mobile-navigation';

// Pages
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Profile from '@/pages/profile';
import Exercises from '@/pages/exercises';
import ExerciseDetailPage from '@/pages/exercise-detail';
import Programs from '@/pages/programs';
import Progress from '@/pages/progress';
import AiAssistant from '@/pages/ai-assistant';
import Avatar3D from '@/pages/avatar-3d';
import AdminDashboard from '@/pages/admin';
import NotFound from '@/pages/not-found';

// Funzione per ottenere il titolo della pagina dalla location
const getPageTitle = (pathname: string): string => {
  // Rimuovi eventuali ID numerici o stringhe specifiche dalla fine del path
  const basePath = pathname.replace(/\/([0-9a-fA-F-]+)$/, ''); 

  switch (basePath) {
    case '/': return 'Dashboard';
    case '/profile': return 'Profilo Utente';
    case '/exercises': return 'Esercizi';
    case '/exercises/detail': return 'Dettaglio Esercizio'; // Modificato per matchare il basePath
    case '/programs': return 'Programmi';
    case '/progress': return 'I Miei Progressi';
    case '/ai-assistant': return 'Assistente AI';
    case '/avatar-3d': return 'Avatar 3D';
    case '/admin': return 'Pannello Admin';
    default: return 'NemFit';
  }
};

function App() {
  const isAuthenticated = true; 
  const [location] = useLocation();
  const pageTitle = getPageTitle(location);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="flex min-h-screen bg-background">
            {isAuthenticated && <Sidebar />}
            <div className={`flex-1 flex flex-col ${isAuthenticated ? 'md:ml-64' : ''}`}>
              {isAuthenticated && <Topbar title={pageTitle} />} {/* Aggiunta la prop title */}
              <main className="flex-1">
                <Switch>
                  <Route path="/login">
                    {isAuthenticated ? <Redirect to="/" /> : <Login />}
                  </Route>
                  <Route path="/register">
                    {isAuthenticated ? <Redirect to="/" /> : <Register />}
                  </Route>
                  <Route path="/">
                    {isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/profile">
                    {isAuthenticated ? <Profile /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/exercises">
                    {isAuthenticated ? <Exercises /> : <Redirect to="/login" />}
                  </Route>
                  {/* La rotta per i dettagli dell'esercizio ora usa un ID */}
                  <Route path="/exercises/:id">
                    {isAuthenticated ? <ExerciseDetailPage /> : <Redirect to="/login" />}
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
                    {isAuthenticated ? <AdminDashboard /> : <Redirect to="/login" />}
                  </Route>
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

