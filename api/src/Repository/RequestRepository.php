<?php

namespace App\Repository;

use App\Entity\Request;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Request|null find($id, $lockMode = null, $lockVersion = null)
 * @method Request|null findOneBy(array $criteria, array $orderBy = null)
 * @method Request[]    findAll()
 * @method Request[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Request::class);
    }

    /**
     * @param $filters
     *
     * @return array
     */
    public function getFilteredRequests($filters)
    {
        $queryParameters = [];
        $queryResult = [];

        $qb = $this->createQueryBuilder('r');
        // $filters['department'] is a required parameter
        $qb->join('r.cities', 'c')
            ->addSelect('c')
            ->andWhere('c.department = :department');
        $queryParameters['department'] = $filters['department'];

        if (array_key_exists('title', $filters)) {
            $qb->andWhere('r.title LIKE :title');
            $queryParameters['title'] = '%'.$filters['title'].'%';
        }

        if (array_key_exists('dateStart', $filters) || array_key_exists('dateEnd', $filters)) {
            if (array_key_exists('dateStart', $filters)) {
                $qb->andWhere('r.dateStart >= :dateStart');
                $queryParameters['dateStart'] = $filters['dateStart'];
            }
            if (array_key_exists('dateEnd', $filters)) {
                $qb->andWhere('r.dateEnd <= :dateEnd');
                $queryParameters['dateEnd'] = $filters['dateEnd'];
            }
        }

        if (array_key_exists('cities', $filters)) {
            $whereQuery = [];
            foreach ($filters['cities'] as $key => $city) {
                $whereQuery[] = "c.name LIKE :city{$key}";
                $queryParameters["city{$key}"] = $city;
            }
            if (count($whereQuery) > 0) {
                $qb->andWhere(implode(' OR ', $whereQuery));
            }
        }

        $qb->setParameters($queryParameters);

        try {
            $queryResult['totalCount'] = count($qb->getQuery()->getScalarResult());
        } catch (\Exception $e) {
            $queryResult['totalCount'] = 0;
        }

        if (array_key_exists('page', $filters)) {
            $qb->setFirstResult(($filters['page'] * 20) - 20)
                ->setMaxResults(20);
        } else {
            $qb->setFirstResult(0)
                ->setMaxResults(20);
        }

        $queryResult['results'] = $qb->addOrderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        return $queryResult;
    }
}
