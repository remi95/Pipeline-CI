<?php

namespace App\Repository;

use App\Entity\Favor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Favor|null find($id, $lockMode = null, $lockVersion = null)
 * @method Favor|null findOneBy(array $criteria, array $orderBy = null)
 * @method Favor[]    findAll()
 * @method Favor[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FavorRepository extends ServiceEntityRepository
{
    /**
     * FavorRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Favor::class);
    }


    /**
     * @param $filters
     *
     * @return array
     */
    public function getFilteredFavors($filters)
    {
        $queryParameters = [];
        $queryResult = [];

        $qb = $this->createQueryBuilder('f');

        // $filters['department'] is a required parameter
        $qb->join('f.cities', 'c')
            ->addSelect('c')
            ->andWhere('c.department = :department');
        $queryParameters['department'] = $filters['department'];

        if (array_key_exists('title', $filters)) {
            $qb->andWhere('f.title LIKE :title');
            $queryParameters['title'] = '%'.$filters['title'].'%';
        }

        if (array_key_exists('categories', $filters)) {
            $whereQuery = [];
            $qb->join('f.category', 'cat')
                ->addSelect('cat');
            foreach ($filters['categories'] as $key => $category) {
                $whereQuery[] = "cat.name LIKE :category{$key}";
                $queryParameters["category{$key}"] = $category;
            }
            if (count($whereQuery) > 0) {
                $qb->andWhere(implode(' OR ', $whereQuery));
            }
        }

        if (array_key_exists('dateStart', $filters) || array_key_exists('dateEnd', $filters)) {
            if (array_key_exists('dateStart', $filters)) {
                $qb->andWhere('f.dateStart >= :dateStart');
                $queryParameters['dateStart'] = $filters['dateStart'];
            }
            if (array_key_exists('dateEnd', $filters)) {
                $qb->andWhere('f.dateEnd <= :dateEnd');
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

        $qb->andWhere('f.status = 1')
            ->setParameters($queryParameters);

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

        $queryResult['results'] = $qb->addOrderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        return $queryResult;
    }

    /**
     * @param $text
     *
     * @return array
     */
    public function getAutocomplete($text) {
        $texts = [];
        $results = $this->createQueryBuilder('f')
            ->where('f.title LIKE :text')
            ->orWhere('f.content LIKE :text')
            ->andWhere('f.status = 1')
            ->setParameter('text', '%'.$text.'%')
            ->getQuery()
            ->getResult();

        if (count($results) > 0) {
            foreach($results as $result) {
                $resultFormatted = new \stdClass();
                $resultFormatted->id = $result->getId();
                $resultFormatted->category = !is_null($result->getCategory()) ? $result->getCategory()->getName() : null;
                $resultFormatted->title = $result->getTitle();
                array_push($texts, $resultFormatted);
            }
        }

        return $texts;
    }
}
