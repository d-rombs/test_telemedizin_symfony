<?php

namespace App\Tests\Entity;

use App\Entity\Appointment;
use App\Entity\Doctor;
use App\Entity\Specialization;
use PHPUnit\Framework\TestCase;

class AppointmentTest extends TestCase
{
    private Doctor $doctor;
    private Appointment $appointment;

    protected function setUp(): void
    {
        $specialization = new Specialization();
        $specialization->setName('Allgemeinmedizin');

        $this->doctor = new Doctor();
        $this->doctor->setName('Dr. Mustermann');
        $this->doctor->setSpecialization($specialization);

        $this->appointment = new Appointment();
        $this->appointment->setDoctor($this->doctor);
        $this->appointment->setPatientName('Max Muster');
        $this->appointment->setPatientEmail('max@example.com');
        $this->appointment->setDateTime(new \DateTime());
    }

    public function testAppointmentDefaults(): void
    {
        $this->assertSame('scheduled', $this->appointment->getStatus());
    }

    public function testAppointmentCanBeCreated(): void
    {
        $this->assertSame('Dr. Mustermann', $this->appointment->getDoctor()->getName());
        $this->assertSame('Max Muster', $this->appointment->getPatientName());
        $this->assertSame('max@example.com', $this->appointment->getPatientEmail());
        $this->assertInstanceOf(\DateTimeInterface::class, $this->appointment->getDateTime());
    }

    public function testAppointmentStatusCanBeChanged(): void
    {
        $this->appointment->setStatus('completed');
        $this->assertSame('completed', $this->appointment->getStatus());
        
        $this->appointment->setStatus('cancelled');
        $this->assertSame('cancelled', $this->appointment->getStatus());
    }

    public function testInvalidStatusThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->appointment->setStatus('invalid');
    }
} 