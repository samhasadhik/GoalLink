import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SelectRole from './pages/SelectRole';
import PlayerRegister from './pages/PlayerRegister';
import ClubRegister from './pages/ClubRegister';
import PlayerDashboard from './pages/PlayerDashboard';
import ClubDashboard from './pages/ClubDashboard';
import PlayerProfile from './pages/PlayerProfile';
import Messages from './pages/Messages';
import EditProfile from './pages/EditProfile';
import ClubSavedPlayers from './pages/ClubSavedPlayers';
import PlayerSavedOpportunities from './pages/PlayerSavedOpportunities';
import ClubProfile from './pages/ClubProfile';
import ClubOpportunities from './pages/ClubOpportunities';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/register/player" element={<PlayerRegister />} />
        <Route path="/register/club" element={<ClubRegister />} />
        <Route path="/player/dashboard" element={<PlayerDashboard />} />
        <Route path="/club/dashboard" element={<ClubDashboard />} />
        <Route path="/player/profile" element={<PlayerProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/player/profile/edit" element={<EditProfile />} />
        <Route path="/club/profile/edit" element={<EditProfile />} /> 
        <Route path="/club/saved" element={<ClubSavedPlayers />} />
        <Route path="/player/saved" element={<PlayerSavedOpportunities />} />
        <Route path="/club/profile" element={<ClubProfile />} />
        <Route path="/club/opportunities" element={<ClubOpportunities />} />
      </Routes>
    </Router>
  );
}

export default App;