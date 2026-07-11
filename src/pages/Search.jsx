import { useState } from 'react';
import Navbar from '../components/Navbar';
import EmptyState from '../components/EmptyState';

export default function Search() {
  const [filters, setFilters] = useState({
    position: '', district: '', experienceLevel: ''
  });

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker'];
  const districts = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Jaffna', 'Kurunegala'];
  const levels = ['Beginner', 'Amateur', 'Semi-Pro', 'Professional'];

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrapper">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Search Players</h1>
        
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <select className="input-field" value={filters.position}
              onChange={(e) => setFilters({...filters, position: e.target.value})}>
              <option value="">All Positions</option>
              {positions.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
            </select>
            
            <select className="input-field" value={filters.district}
              onChange={(e) => setFilters({...filters, district: e.target.value})}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            
            <select className="input-field" value={filters.experienceLevel}
              onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}>
              <option value="">All Levels</option>
              {levels.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
            </select>
            
            <button className="btn-primary">Search Players</button>
          </div>
        </div>

        <EmptyState 
          title="Search for Players" 
          description="Use the filters above to find football players across Sri Lanka" 
        />
      </div>
    </div>
  );
}