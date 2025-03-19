import React, { useState, useEffect } from 'react';
import { getDoctors, searchDoctors } from '../services/api';

interface DoctorListProps {
  onSelectDoctor: (doctor: any) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Hier müssen wir die Schnittstelle des Symfony-Backends verwenden
        const doctorsData = await getDoctors();
        
        // Spezialisierungen aus den Ärzten extrahieren - ohne JSON.stringify/parse
        const specializationsMap = new Map();
        doctorsData.forEach((doctor: any) => {
          if (doctor.specialization) {
            const specId = doctor.specialization.id;
            if (!specializationsMap.has(specId)) {
              specializationsMap.set(specId, {
                id: doctor.specialization.id,
                name: doctor.specialization.name
              });
            }
          }
        });
        
        // Aus der Map ein Array machen
        const uniqueSpecializations = Array.from(specializationsMap.values());
        
        setDoctors(doctorsData);
        setSpecializations(uniqueSpecializations);
        setError(null);
      } catch (err) {
        setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) {
      try {
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
        setError(null);
      } catch (err) {
        setError('Fehler bei der Suche. Bitte versuchen Sie es später erneut.');
        console.error(err);
      }
      return;
    }

    try {
      setLoading(true);
      const results = await searchDoctors(searchQuery);
      setDoctors(results);
      setError(null);
    } catch (err) {
      setError('Fehler bei der Suche. Bitte versuchen Sie es später erneut.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = selectedSpecialization
    ? doctors.filter(doctor => doctor.specialization && doctor.specialization.id === selectedSpecialization)
    : doctors;

  return (
    <div className="doctor-list">
      <h2>Ärzte</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Suche nach Ärzten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Suchen</button>
      </div>

      <div className="filter-container">
        <label>
          Fachgebiet:
          <select
            value={selectedSpecialization || ''}
            onChange={(e) => setSelectedSpecialization(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Alle Fachgebiete</option>
            {specializations.map((specialization: any) => (
              <option key={specialization.id} value={specialization.id}>
                {specialization.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p>Laden...</p>}
      {error && <p className="error">{error}</p>}
      
      <ul className="doctors">
        {filteredDoctors.map((doctor: any) => (
          <li key={doctor.id} onClick={() => onSelectDoctor(doctor)} className="doctor-item">
            <h3>{doctor.name}</h3>
            <p>
              Fachgebiet: {doctor.specialization ? doctor.specialization.name : 'Unbekannt'}
            </p>
          </li>
        ))}
        {!loading && filteredDoctors.length === 0 && (
          <p>Keine Ärzte gefunden.</p>
        )}
      </ul>
    </div>
  );
};

export default DoctorList; 