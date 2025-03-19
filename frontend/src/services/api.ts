import axios from 'axios';
import { Doctor, Specialization, TimeSlot, Appointment } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fachgebiete API
export const getSpecializations = async (): Promise<Specialization[]> => {
  const response = await api.get('/specializations');
  return response.data['hydra:member'];
};

// Ärzte API
export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get('/doctors');
  return response.data['hydra:member'];
};

export const getDoctor = async (id: number): Promise<Doctor> => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const searchDoctors = async (term: string): Promise<Doctor[]> => {
  const response = await api.get(`/doctors/search?term=${encodeURIComponent(term)}`);
  return response.data;
};

// Zeitfenster API
export const getTimeSlots = async (): Promise<TimeSlot[]> => {
  const response = await api.get('/time_slots');
  return response.data['hydra:member'];
};

export const getTimeSlotsForDoctor = async (doctorId: number): Promise<TimeSlot[]> => {
  const response = await api.get(`/time_slots?doctor=${doctorId}&isAvailable=true`);
  return response.data['hydra:member'];
};

export const checkTimeSlotAvailability = async (id: number): Promise<boolean> => {
  try {
    const response = await api.get(`/time_slots/${id}`);
    return response.data.isAvailable;
  } catch (error) {
    console.error('Fehler bei der Verfügbarkeitsprüfung:', error);
    return false;
  }
};

// Echtzeit-Verfügbarkeitsprüfung mit Polling alle 5 Sekunden
export const setupRealTimeAvailabilityCheck = (
  timeSlotId: number, 
  onUpdate: (available: boolean) => void,
  interval = 5000
): { stop: () => void } => {
  let isRunning = true;
  
  const checkInterval = setInterval(async () => {
    if (!isRunning) return;
    
    try {
      const isAvailable = await checkTimeSlotAvailability(timeSlotId);
      onUpdate(isAvailable);
      
      if (!isAvailable) {
        clearInterval(checkInterval);
      }
    } catch (error) {
      console.error('Fehler bei der Echtzeit-Verfügbarkeitsprüfung:', error);
    }
  }, interval);
  
  return {
    stop: () => {
      isRunning = false;
      clearInterval(checkInterval);
    }
  };
};

// Termine API
export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get('/appointments');
  return response.data['hydra:member'];
};

export const getAppointmentsByEmail = async (email: string): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/by-email?email=${encodeURIComponent(email)}`);
  return response.data;
};

export const createAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const response = await api.post('/appointments', appointment);
  return response.data;
};

export const cancelAppointment = async (id: number): Promise<void> => {
  await api.patch(`/appointments/${id}/cancel`);
};

export default api; 