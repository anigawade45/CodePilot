import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createClient } from './lib/client'
import { useStore } from './store/useStore'
import { setAuthToken } from './services/api'

// Pages
import Auth from './features/auth/components/Auth'
import Dashboard from './pages/Dashboard'
import CodeInput from './pages/CodeInput'
import ReviewResult from './pages/ReviewResult'
import History from './pages/History'
import SharedReview from './pages/SharedReview'
import Landing from './pages/Landing'

const supabase = createClient();

function App() {
  const { session, setSession } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setAuthToken(session.access_token);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setAuthToken(session.access_token);
      else setAuthToken(null);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return (
    <BrowserRouter>
      <div className="dark min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
        <Routes>
          {/* Public Sharing & Landing */}
          <Route path="/" element={<Landing />} />
          <Route path="/share/:token" element={<SharedReview />} />

          {!session ? (
            <Route path="*" element={
              <div className="h-screen flex items-center justify-center p-6 bg-slate-950">
                <Auth onSession={setSession} />
              </div>
            } />
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new" element={<CodeInput />} />
              <Route path="/history" element={<History />} />
              <Route path="/review/:id" element={<ReviewResult />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
