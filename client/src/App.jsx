import { lazy, Suspense, memo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useAuthListener } from './hooks/useAuthListener'
import { usePrefetch } from './hooks/usePrefetch'
import { useStore } from './store/useStore'
import { ROUTES } from './constants/routes'

// Core Modules
import MainLayout from './layouts/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { ProtectedLayout, PublicRoute } from './guards/authGuards'
import LoadingState from './components/ui/LoadingState'

// 🏗️ MEMOIZED UI CLUSTERS
const Splash = memo(() => <LoadingState message="Hydrating Session..." />);
Splash.displayName = 'Splash';

const Loader = memo(() => <LoadingState message="Accessing Layer..." />);
Loader.displayName = 'Loader';

// 📦 DYNAMIC BUNDLES
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CodeInput = lazy(() => import('./pages/CodeInput'));
const ReviewResult = lazy(() => import('./pages/ReviewResult'));
const History = lazy(() => import('./pages/History'));
const SharedReview = lazy(() => import('./pages/SharedReview'));
const Auth = lazy(() => import('./features/auth/components/Auth'));

function App() {
  const { session } = useStore();

  // 📡 GLOBAL ORCHESTRATORS
  useAuthListener();
  usePrefetch(session);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <MainLayout>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* 📍 PUBLIC SECTOR */}
                <Route path={ROUTES.LANDING} element={
                  <PublicRoute session={session}>
                    <Landing />
                  </PublicRoute>
                } />

                <Route path={ROUTES.SHARED_REVIEW} element={<SharedReview />} />

                <Route path={ROUTES.AUTH} element={
                  <PublicRoute session={session}>
                    <div className="h-screen flex items-center justify-center p-6">
                      <Auth />
                    </div>
                  </PublicRoute>
                } />

                {/* 🛡️ PROTECTED CLUSTER */}
                <Route element={<ProtectedLayout session={session} SplashComponent={<Splash />} />}>
                  <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                  <Route path={ROUTES.NEW_ANALYSIS} element={<CodeInput />} />
                  <Route path={ROUTES.HISTORY} element={<History />} />
                  <Route path={ROUTES.REVIEW_DETAIL} element={<ReviewResult />} />
                </Route>

                {/* 🔄 AUTOMATED DISPATCHER */}
                <Route path="*" element={<Navigate to={session ? ROUTES.DASHBOARD : ROUTES.LANDING} replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </MainLayout>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
