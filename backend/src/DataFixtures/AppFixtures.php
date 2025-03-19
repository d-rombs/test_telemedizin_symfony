<?php

namespace App\DataFixtures;

use App\Entity\Doctor;
use App\Entity\Specialization;
use App\Entity\TimeSlot;
use App\Entity\Appointment;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Fachgebiete
        $specializations = [
            'Allgemeinmedizin',
            'Kardiologie',
            'Dermatologie',
            'Neurologie',
            'Orthopädie',
            'Pädiatrie',
            'Psychiatrie',
            'Gynäkologie',
            'Urologie',
            'HNO',
        ];

        $specializationEntities = [];
        foreach ($specializations as $specializationName) {
            $specialization = new Specialization();
            $specialization->setName($specializationName);
            $manager->persist($specialization);
            $specializationEntities[] = $specialization;
        }
        
        // Flush um die Specializations zu speichern und IDs zu erhalten
        $manager->flush();

        // Ärzte
        $doctors = [
            ['Dr. Hans Müller', $specializationEntities[0]],
            ['Dr. Maria Schmidt', $specializationEntities[1]],
            ['Dr. Thomas Weber', $specializationEntities[2]],
            ['Dr. Anna Becker', $specializationEntities[3]],
            ['Dr. Peter Hoffmann', $specializationEntities[4]],
            ['Dr. Julia Fischer', $specializationEntities[5]],
            ['Dr. Michael Wagner', $specializationEntities[6]],
            ['Dr. Sarah Meyer', $specializationEntities[7]],
            ['Dr. Andreas Schulz', $specializationEntities[8]],
            ['Dr. Laura Koch', $specializationEntities[9]],
        ];

        $doctorEntities = [];
        foreach ($doctors as [$name, $specialization]) {
            $doctor = new Doctor();
            $doctor->setName($name);
            $doctor->setSpecialization($specialization);
            $manager->persist($doctor);
            $doctorEntities[] = $doctor;
        }
        
        // Flush um die Doctors zu speichern und IDs zu erhalten
        $manager->flush();

        // Zeitfenster
        $now = new \DateTime();
        $startTime = (clone $now)->setTime(9, 0);
        
        for ($dayOffset = 1; $dayOffset <= 14; $dayOffset++) {
            $day = (clone $startTime)->modify("+$dayOffset days");
            
            foreach ($doctorEntities as $doctor) {
                // Vormittags-Zeitfenster
                for ($hour = 9; $hour < 12; $hour++) {
                    $slotStart = (clone $day)->setTime($hour, 0);
                    $slotEnd = (clone $slotStart)->modify('+30 minutes');
                    
                    $timeSlot = new TimeSlot();
                    $timeSlot->setDoctor($doctor);
                    $timeSlot->setStartTime($slotStart);
                    $timeSlot->setEndTime($slotEnd);
                    $timeSlot->setIsAvailable(true);
                    $manager->persist($timeSlot);
                }
                
                // Nachmittags-Zeitfenster
                for ($hour = 14; $hour < 17; $hour++) {
                    $slotStart = (clone $day)->setTime($hour, 0);
                    $slotEnd = (clone $slotStart)->modify('+30 minutes');
                    
                    $timeSlot = new TimeSlot();
                    $timeSlot->setDoctor($doctor);
                    $timeSlot->setStartTime($slotStart);
                    $timeSlot->setEndTime($slotEnd);
                    $timeSlot->setIsAvailable(true);
                    $manager->persist($timeSlot);
                }
            }
        }
        
        // Flush um die TimeSlots zu speichern
        $manager->flush();

        // Beispiel-Termine
        $appointment1 = new Appointment();
        $appointment1->setDoctor($doctorEntities[0]);
        $appointment1->setPatientName('Max Mustermann');
        $appointment1->setPatientEmail('max@example.com');
        $appointment1->setDateTime((clone $now)->modify('+2 days')->setTime(10, 0));
        $appointment1->setStatus(Appointment::STATUS_SCHEDULED);
        $manager->persist($appointment1);

        $appointment2 = new Appointment();
        $appointment2->setDoctor($doctorEntities[1]);
        $appointment2->setPatientName('Erika Musterfrau');
        $appointment2->setPatientEmail('erika@example.com');
        $appointment2->setDateTime((clone $now)->modify('+3 days')->setTime(15, 0));
        $appointment2->setStatus(Appointment::STATUS_SCHEDULED);
        $manager->persist($appointment2);

        $appointment3 = new Appointment();
        $appointment3->setDoctor($doctorEntities[2]);
        $appointment3->setPatientName('Max Mustermann');
        $appointment3->setPatientEmail('max@example.com');
        $appointment3->setDateTime((clone $now)->modify('+5 days')->setTime(9, 30));
        $appointment3->setStatus(Appointment::STATUS_COMPLETED);
        $manager->persist($appointment3);

        $manager->flush();
    }
} 