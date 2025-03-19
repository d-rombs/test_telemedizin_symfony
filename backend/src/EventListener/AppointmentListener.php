<?php

namespace App\EventListener;

use App\Entity\Appointment;
use App\Entity\TimeSlot;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class AppointmentListener
{
    private EntityManagerInterface $entityManager;
    private MailerInterface $mailer;

    public function __construct(EntityManagerInterface $entityManager, MailerInterface $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
    }

    public function prePersist(Appointment $appointment, LifecycleEventArgs $args): void
    {
        // Suche nach einem passenden Zeitfenster und markiere es als nicht verfügbar
        $timeSlotRepository = $this->entityManager->getRepository(TimeSlot::class);
        
        $matchingTimeSlot = $timeSlotRepository->createQueryBuilder('t')
            ->where('t.doctor = :doctor')
            ->andWhere('t.startTime <= :dateTime')
            ->andWhere('t.endTime >= :dateTime')
            ->andWhere('t.isAvailable = :available')
            ->setParameter('doctor', $appointment->getDoctor())
            ->setParameter('dateTime', $appointment->getDateTime())
            ->setParameter('available', true)
            ->getQuery()
            ->getOneOrNullResult();
        
        if ($matchingTimeSlot) {
            $matchingTimeSlot->setIsAvailable(false);
            // Explizit speichern, um sicherzustellen, dass die Änderungen angewendet werden
            $this->entityManager->persist($matchingTimeSlot);
            $this->entityManager->flush();
        }
    }

    public function postPersist(Appointment $appointment, LifecycleEventArgs $args): void
    {
        // Sende eine Bestätigungs-E-Mail
        $this->sendConfirmationEmail($appointment);
    }

    private function sendConfirmationEmail(Appointment $appointment): void
    {
        $email = (new Email())
            ->from('telemedizin@example.com')
            ->to($appointment->getPatientEmail())
            ->subject('Terminbestätigung')
            ->html(sprintf(
                '<p>Sehr geehrte(r) %s,</p>
                <p>Ihr Termin am %s mit Dr. %s wurde erfolgreich gebucht.</p>
                <p>Mit freundlichen Grüßen,<br>Ihr Telemedizin-Team</p>',
                $appointment->getPatientName(),
                $appointment->getDateTime()->format('d.m.Y H:i'),
                $appointment->getDoctor()->getName()
            ));
            
        $this->mailer->send($email);
    }
} 