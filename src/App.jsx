import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import TeamRankings from './pages/TeamRankings'
import CTFRankings from './pages/CTFRankings'
import UniversityRankings from './pages/UniversityRankings'

function App() {
  // Align router base with Vite base so it works on GitHub Pages and locally
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  return (
    <BrowserRouter 
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/universities" replace />} />
          <Route path="teams" element={<TeamRankings />} />
          <Route path="ctfs" element={<CTFRankings />} />
          <Route path="universities" element={<UniversityRankings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
