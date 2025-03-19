export interface Doctor {
  id: number;
  name: string;
  specialization: Specialization;
  timeSlots?: TimeSlot[];
}

export interface Specialization {
  id: number;
  name: string;
}

export interface TimeSlot {
  id: number;
  doctor: Doctor;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id?: number;
  doctor: Doctor;
  patientName: string;
  patientEmail: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ApiError {
  message: string;
  code?: string;
  violations?: {
    propertyPath: string;
    message: string;
  }[];
} 