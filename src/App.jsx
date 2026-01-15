import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import TeamRankings from './pages/TeamRankings'
import CTFRankings from './pages/CTFRankings'
import UniversityRankings from './pages/UniversityRankings'

function App() {
  return (
    <BrowserRouter 
      basename="/ctfrankings"
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
