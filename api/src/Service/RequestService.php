<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-16
 * Time: 11:23
 */

namespace App\Service;

use App\Entity\City;
use App\Entity\Request as Req;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class FavorService
 * @package App\Service
 */
class RequestService
{
    /** @var EntityManagerInterface $em */
    private $em;

    /**
     * FavorService constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param Request $req
     *
     * @return mixed
     * @throws \Exception
     */
    public function getRequestsFromRequest(Request $req) {
        $params = $req->query;
        if (!$params->has('department')) {
            throw new \Exception('Missing department parameter');
        }
        $reqRepository = $this->em->getRepository(Req::class);

        return $reqRepository->getFilteredRequests($params->all());
    }

    /**
     * @param int $id
     *
     * @return Req
     * @throws \Exception
     */
    public function getRequest($id) {
        $req= $this->em->getRepository(Req::class)
            ->find($id)
        ;

        if (is_null($req)) {
            throw new \Exception('No request found with this id');
        }

        return $req;
    }

    /**
     * @param      $formData
     * @param Req $req
     *
     * @return Req
     * @throws \Exception
     */
    public function handleRequestFormSubmission($formData, Req $req): ?Req
    {
        foreach ($formData['cities'] as $city) {
            $cityToAdd = $this->em->getRepository(City::class)->findOneBy(['name' => $city['name'], 'postalCode' => $city['postalCode']]);
            $req->addCity($cityToAdd);
        }

        $req->setDateStart(new \DateTime($formData['dateStart']));
        $req->setDateEnd(new \DateTime($formData['dateEnd']));

        if (array_key_exists('pictures', $formData)) {
            foreach ($formData['pictures'] as $picture) {
                $req->addPicture($picture);
            }
        }

        $this->em->persist($req);
        $this->em->flush();

        return $req;
    }
}