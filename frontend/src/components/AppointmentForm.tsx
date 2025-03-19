import React, { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { createAppointment } from '../services/api';

interface AppointmentFormProps {
  doctor: any;
  selectedTimeSlot: any;
  onAppointmentCreated: (appointment: any) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  doctor,
  selectedTimeSlot,
  onAppointmentCreated,
  onCancel
}) => {
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctor || !selectedTimeSlot) {
      setError('Bitte wählen Sie einen Arzt und ein Zeitfenster aus.');
      return;
    }
    
    if (!patientName.trim() || !patientEmail.trim()) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const appointmentData = {
        doctor: `/api/doctors/${doctor.id}`,
        patientName: patientName,
        patientEmail: patientEmail,
        dateTime: selectedTimeSlot.startTime,
        status: 'scheduled'
      };
      
      const createdAppointment = await createAppointment(appointmentData);
      
      setSuccess(true);
      onAppointmentCreated(createdAppointment);
      
      // Reset form
      setPatientName('');
      setPatientEmail('');
    } catch (err: any) {
      if (err.response && err.response.data) {
        try {
          // Versuche, die Fehlermeldung aus der API zu parsen
          const errorData = JSON.parse(err.response.data);
          setError(errorData["hydra:description"] || 'Fehler bei der Terminbuchung. Bitte versuchen Sie es später erneut.');
        } catch (e) {
          setError('Fehler bei der Terminbuchung. Bitte versuchen Sie es später erneut.');
        }
      } else {
        setError('Fehler bei der Terminbuchung. Bitte versuchen Sie es später erneut.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor || !selectedTimeSlot) {
    return <p>Bitte wählen Sie einen Arzt und ein Zeitfenster aus.</p>;
  }

  if (success) {
    return (
      <div className="appointment-success">
        <h2>Termin erfolgreich gebucht!</h2>
        <p>
          Vielen Dank für Ihre Buchung. Eine Bestätigungsmail wurde an {patientEmail} gesendet.
        </p>
        <button onClick={onCancel}>Zurück zur Arztauswahl</button>
      </div>
    );
  }

  return (
    <div className="appointment-form">
      <h2>Termin buchen</h2>
      
      <div className="appointment-details">
        <p><strong>Arzt:</strong> {doctor.name}</p>
        <p><strong>Fachgebiet:</strong> {doctor.specialization?.name}</p>
        <p><strong>Datum:</strong> {format(new Date(selectedTimeSlot.startTime), 'EEEE, d. MMMM yyyy', { locale: de })}</p>
        <p><strong>Uhrzeit:</strong> {format(new Date(selectedTimeSlot.startTime), 'HH:mm')} - {format(new Date(selectedTimeSlot.endTime), 'HH:mm')}</p>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientName">Name:</label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="patientEmail">E-Mail:</label>
          <input
            type="email"
            id="patientEmail"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Abbrechen
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Wird gebucht...' : 'Termin buchen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm; 