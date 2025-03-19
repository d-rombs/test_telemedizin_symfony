<?php

namespace App\Repository;

use App\Entity\TimeSlot;
use App\Entity\Doctor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TimeSlot>
 *
 * @method TimeSlot|null find($id, $lockMode = null, $lockVersion = null)
 * @method TimeSlot|null findOneBy(array $criteria, array $orderBy = null)
 * @method TimeSlot[]    findAll()
 * @method TimeSlot[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TimeSlotRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TimeSlot::class);
    }

    /**
     * Findet alle verfügbaren Zeitfenster für einen bestimmten Arzt
     */
    public function findAvailableForDoctor(Doctor $doctor): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.doctor = :doctor')
            ->andWhere('t.isAvailable = :available')
            ->andWhere('t.startTime > :now')
            ->setParameter('doctor', $doctor)
            ->setParameter('available', true)
            ->setParameter('now', new \DateTime())
            ->orderBy('t.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Findet alle verfügbaren Zeitfenster für alle Ärzte
     */
    public function findAllAvailable(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.isAvailable = :available')
            ->andWhere('t.startTime > :now')
            ->setParameter('available', true)
            ->setParameter('now', new \DateTime())
            ->orderBy('t.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 