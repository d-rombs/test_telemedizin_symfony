import React, { useState } from 'react';
import { Container, Form, Button, Card, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { getAppointmentsByEmail, cancelAppointment } from '../services/api';
import { Appointment } from '../types';

const MyAppointments: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const data = await getAppointmentsByEmail(email);
      setAppointments(data);
      
      if (data.length === 0) {
        setSuccess('Keine Termine für diese E-Mail-Adresse gefunden.');
      }
    } catch (err) {
      setError('Fehler beim Abrufen der Termine. Bitte versuchen Sie es später erneut.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmCancelAppointment = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel?.id) return;
    
    try {
      setCancelLoading(true);
      await cancelAppointment(appointmentToCancel.id);
      
      // Update the appointments list
      const updatedAppointments = await getAppointmentsByEmail(email);
      setAppointments(updatedAppointments);
      
      setSuccess('Termin erfolgreich storniert.');
      setShowCancelModal(false);
    } catch (err) {
      setError('Fehler beim Stornieren des Termins. Bitte versuchen Sie es später erneut.');
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'Geplant';
      case 'completed':
        return 'Abgeschlossen';
      case 'cancelled':
        return 'Storniert';
      default:
        return status;
    }
  };

  return (
    <div className="appointment-manager">
      <h2>Termine verwalten</h2>
      
      <form onSubmit={handleSearch} className="email-search-form">
        <div className="form-group">
          <label htmlFor="email">E-Mail-Adresse:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Suche...' : 'Termine suchen'}
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      {appointments.length > 0 && (
        <div className="appointments-list">
          <h3>Ihre Termine</h3>
          
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Uhrzeit</th>
                <th>Arzt</th>
                <th>Fachgebiet</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment: any) => (
                <tr key={appointment.id}>
                  <td>{format(parseISO(appointment.dateTime), 'dd.MM.yyyy', { locale: de })}</td>
                  <td>{format(parseISO(appointment.dateTime), 'HH:mm', { locale: de })}</td>
                  <td>{appointment.doctor?.name}</td>
                  <td>{appointment.doctor?.specialization?.name}</td>
                  <td>{getStatusText(appointment.status)}</td>
                  <td>
                    {appointment.status === 'scheduled' && (
                      <button 
                        onClick={() => confirmCancelAppointment(appointment as Appointment)}
                        disabled={loading}
                      >
                        Stornieren
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Termin stornieren</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sind Sie sicher, dass Sie diesen Termin stornieren möchten?
          {appointmentToCancel && (
            <div className="mt-3">
              <p className="mb-1"><strong>Arzt:</strong> Dr. {appointmentToCancel.doctor.name}</p>
              <p className="mb-1"><strong>Datum:</strong> {format(parseISO(appointmentToCancel.dateTime), 'EEEE, dd. MMMM yyyy', { locale: de })}</p>
              <p className="mb-1"><strong>Uhrzeit:</strong> {format(parseISO(appointmentToCancel.dateTime), 'HH:mm')} Uhr</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={cancelLoading}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={handleCancelAppointment} disabled={cancelLoading}>
            {cancelLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Storniere...
              </>
            ) : "Termin stornieren"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyAppointments; 