import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { getTimeSlotsForDoctor } from '../services/api';

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

  const handleSelectTimeSlot = async (timeSlot: any) => {
    try {
      // Im Symfony-Projekt könnte hier auch eine Verfügbarkeitsprüfung stattfinden
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
              className="time-slot-item"
              onClick={() => handleSelectTimeSlot(slot)}
            >
              <p>
                {format(new Date(slot.startTime), 'HH:mm')} - 
                {format(new Date(slot.endTime), 'HH:mm')}
              </p>
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