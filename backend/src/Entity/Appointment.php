<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Patch;
use App\Repository\AppointmentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['appointment:read']]),
        new GetCollection(normalizationContext: ['groups' => ['appointment:read']]),
        new Post(denormalizationContext: ['groups' => ['appointment:write']]),
        new Delete(),
        new Patch(denormalizationContext: ['groups' => ['appointment:write']])
    ],
    order: ['dateTime' => 'ASC'],
)]
#[ORM\HasLifecycleCallbacks]
class Appointment
{
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['appointment:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'appointments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?Doctor $doctor = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 255)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?string $patientName = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?string $patientEmail = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?\DateTimeInterface $dateTime = null;

    #[ORM\Column(length: 20)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?string $status = self::STATUS_SCHEDULED;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDoctor(): ?Doctor
    {
        return $this->doctor;
    }

    public function setDoctor(?Doctor $doctor): static
    {
        $this->doctor = $doctor;

        return $this;
    }

    public function getPatientName(): ?string
    {
        return $this->patientName;
    }

    public function setPatientName(string $patientName): static
    {
        $this->patientName = $patientName;

        return $this;
    }

    public function getPatientEmail(): ?string
    {
        return $this->patientEmail;
    }

    public function setPatientEmail(string $patientEmail): static
    {
        $this->patientEmail = $patientEmail;

        return $this;
    }

    public function getDateTime(): ?\DateTimeInterface
    {
        return $this->dateTime;
    }

    public function setDateTime(\DateTimeInterface $dateTime): static
    {
        $this->dateTime = $dateTime;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        if (!in_array($status, [self::STATUS_SCHEDULED, self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            throw new \InvalidArgumentException("Invalid status");
        }
        
        $this->status = $status;

        return $this;
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        // Bei der Erstellung eines Termins wird der entsprechende Zeitslot als nicht verfügbar markiert
        // Diese Logik sollte in einem Service oder Event Listener implementiert werden
    }
} 