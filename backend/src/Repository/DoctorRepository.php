<?php

namespace App\Repository;

use App\Entity\Doctor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Doctor>
 *
 * @method Doctor|null find($id, $lockMode = null, $lockVersion = null)
 * @method Doctor|null findOneBy(array $criteria, array $orderBy = null)
 * @method Doctor[]    findAll()
 * @method Doctor[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DoctorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Doctor::class);
    }

    /**
     * Sucht nach Ärzten basierend auf Name oder Fachgebiet
     *
     * @param string $searchTerm Der Suchbegriff
     * @return Doctor[] Returns an array of Doctor objects
     */
    public function searchByNameOrSpecialization(string $searchTerm): array
    {
        return $this->createQueryBuilder('d')
            ->leftJoin('d.specialization', 's')
            ->where('d.name LIKE :term')
            ->orWhere('s.name LIKE :term')
            ->setParameter('term', '%' . $searchTerm . '%')
            ->orderBy('d.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 