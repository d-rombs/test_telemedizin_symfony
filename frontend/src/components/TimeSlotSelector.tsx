import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { getTimeSlotsForDoctor, checkTimeSlotAvailability, setupRealTimeAvailabilityCheck } from '../services/api';

interface TimeSlotSelectorProps {
  doctor: any;
  onSelectTimeSlot: (timeSlot: any) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ doctor, onSelectTimeSlot }) => {
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [realTimeChecks, setRealTimeChecks] = useState<{ [key: number]: { stop: () => void } }>({});

  useEffect(() => {
    if (!doctor) return;

    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        const data = await getTimeSlotsForDoctor(doctor.id);
        setTimeSlots(data);
        
        // Extract unique dates from time slots
        const datesSet = new Set<string>();
        data.forEach((slot: any) => {
          datesSet.add(format(new Date(slot.startTime), 'yyyy-MM-dd'));
        });
        const dates = Array.from(datesSet);
        setAvailableDates(dates);
        
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
        
        setError(null);
      } catch (err) {
        setError('Fehler beim Laden der Zeitfenster. Bitte versuchen Sie es später erneut.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [doctor]);

  // Starte Echtzeit-Verfügbarkeitsprüfungen für sichtbare Zeitslots
  useEffect(() => {
    // Stoppe alle existierenden Prüfungen
    Object.values(realTimeChecks).forEach(check => check.stop());
    setRealTimeChecks({});

    // Starte neue Prüfungen für sichtbare Zeitslots
    const visibleSlots = selectedDate
      ? timeSlots.filter((slot: any) => 
          format(new Date(slot.startTime), 'yyyy-MM-dd') === selectedDate
        )
      : timeSlots;

    visibleSlots.forEach((slot: any) => {
      if (slot.isAvailable) {
        const check = setupRealTimeAvailabilityCheck(slot.id, (isAvailable) => {
          setTimeSlots(prevSlots => 
            prevSlots.map(s => 
              s.id === slot.id 
                ? { ...s, isAvailable: isAvailable }
                : s
            )
          );
          
          if (!isAvailable) {
            setError('Ein oder mehrere Zeitfenster sind nicht mehr verfügbar.');
          }
        });
        
        setRealTimeChecks(prev => ({
          ...prev,
          [slot.id]: check
        }));
      }
    });

    // Aufräumfunktion
    return () => {
      Object.values(realTimeChecks).forEach(check => check.stop());
    };
  }, [selectedDate, timeSlots]);

  const handleSelectTimeSlot = async (timeSlot: any) => {
    try {
      // Verfügbarkeit in Echtzeit prüfen, bevor der Slot ausgewählt wird
      const isAvailable = await checkTimeSlotAvailability(timeSlot.id);
      
      if (!isAvailable) {
        setError('Dieses Zeitfenster ist nicht mehr verfügbar. Bitte wählen Sie ein anderes.');
        
        // Zeitslots aktualisieren
        if (doctor) {
          const data = await getTimeSlotsForDoctor(doctor.id);
          setTimeSlots(data);
        }
        
        return;
      }
      
      onSelectTimeSlot(timeSlot);
    } catch (err) {
      setError('Fehler bei der Verfügbarkeitsprüfung. Bitte versuchen Sie es später erneut.');
      console.error(err);
    }
  };

  const filteredTimeSlots = selectedDate
    ? timeSlots.filter((slot: any) => 
        format(new Date(slot.startTime), 'yyyy-MM-dd') === selectedDate
      )
    : timeSlots;

  if (!doctor) {
    return <p>Bitte wählen Sie zuerst einen Arzt aus.</p>;
  }

  return (
    <div className="time-slot-list">
      <h2>Verfügbare Termine für {doctor.name}</h2>
      
      {loading && <p>Laden...</p>}
      {error && <p className="error">{error}</p>}
      
      {availableDates.length > 0 && (
        <div className="date-selector">
          <label>
            Datum auswählen:
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {availableDates.map((date: string) => (
                <option key={date} value={date}>
                  {format(new Date(date), 'EEEE, d. MMMM yyyy', { locale: de })}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      
      <div className="time-slots">
        {filteredTimeSlots.length > 0 ? (
          filteredTimeSlots.map((slot: any) => (
            <div 
              key={slot.id} 
              className={`time-slot-item ${!slot.isAvailable ? 'unavailable' : ''}`}
              onClick={() => slot.isAvailable && handleSelectTimeSlot(slot)}
            >
              <p>
                {format(new Date(slot.startTime), 'HH:mm')} - 
                {format(new Date(slot.endTime), 'HH:mm')}
              </p>
              {!slot.isAvailable && (
                <span className="status-badge">Nicht verfügbar</span>
              )}
            </div>
          ))
        ) : (
          <p>Keine verfügbaren Zeitfenster für diesen Tag.</p>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector; 