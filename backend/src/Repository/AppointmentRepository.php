<?php

namespace App\Repository;

use App\Entity\Appointment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Appointment>
 *
 * @method Appointment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointment[]    findAll()
 * @method Appointment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
    }

    /**
     * Findet Termine für eine bestimmte E-Mail-Adresse
     */
    public function findByEmail(string $email): array
    {
        return $this->createQueryBuilder('a')
            ->where('a.patientEmail = :email')
            ->andWhere('a.status != :cancelled')
            ->setParameter('email', $email)
            ->setParameter('cancelled', Appointment::STATUS_CANCELLED)
            ->orderBy('a.dateTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Findet bevorstehende Termine
     */
    public function findUpcoming(): array
    {
        return $this->createQueryBuilder('a')
            ->where('a.dateTime > :now')
            ->andWhere('a.status = :status')
            ->setParameter('now', new \DateTime())
            ->setParameter('status', Appointment::STATUS_SCHEDULED)
            ->orderBy('a.dateTime', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 