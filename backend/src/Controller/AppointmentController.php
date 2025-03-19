<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class AppointmentController extends AbstractController
{
    #[Route('/appointments/by-email', name: 'app_appointments_by_email', methods: ['GET'])]
    public function findByEmail(Request $request, AppointmentRepository $appointmentRepository, SerializerInterface $serializer): JsonResponse
    {
        $email = $request->query->get('email');
        
        if (!$email) {
            return $this->json(['message' => 'E-Mail-Adresse erforderlich'], 400);
        }
        
        $appointments = $appointmentRepository->findByEmail($email);
        
        $data = $serializer->serialize($appointments, 'json', [
            'groups' => ['appointment:read']
        ]);
        
        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/appointments/{id}/cancel', name: 'app_appointments_cancel', methods: ['PATCH'])]
    public function cancel(int $id, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $appointment = $entityManager->getRepository(Appointment::class)->find($id);
        
        if (!$appointment) {
            return $this->json(['message' => 'Termin nicht gefunden'], 404);
        }
        
        $appointment->setStatus(Appointment::STATUS_CANCELLED);
        $entityManager->flush();
        
        // E-Mail-Benachrichtigung senden
        $this->sendCancellationEmail($appointment, $mailer);
        
        return $this->json(['message' => 'Termin erfolgreich storniert']);
    }
    
    private function sendCancellationEmail(Appointment $appointment, MailerInterface $mailer): void
    {
        $email = (new Email())
            ->from('telemedizin@example.com')
            ->to($appointment->getPatientEmail())
            ->subject('Ihr Termin wurde storniert')
            ->html(sprintf(
                '<p>Sehr geehrte(r) %s,</p>
                <p>Ihr Termin am %s mit Dr. %s wurde storniert.</p>
                <p>Mit freundlichen Grüßen,<br>Ihr Telemedizin-Team</p>',
                $appointment->getPatientName(),
                $appointment->getDateTime()->format('d.m.Y H:i'),
                $appointment->getDoctor()->getName()
            ));
            
        $mailer->send($email);
    }
} 