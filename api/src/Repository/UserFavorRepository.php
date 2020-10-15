<?php

namespace App\Repository;

use App\Entity\UserFavor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method UserFavor|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserFavor|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserFavor[]    findAll()
 * @method UserFavor[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserFavorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserFavor::class);
    }

    // /**
    //  * @return UserFavor[] Returns an array of UserFavor objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserFavor
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
