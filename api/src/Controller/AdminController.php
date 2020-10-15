<?php
// src/Controller/AdminController.php
namespace App\Controller;

use App\Entity\Category;
use App\Entity\Favor;
use App\Entity\Picture;
use App\Entity\User;
use App\Entity\UserFavor;
use Doctrine\ORM\EntityManager;
use EasyCorp\Bundle\EasyAdminBundle\Controller\EasyAdminController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AdminController extends EasyAdminController
{
    /** @var array The full configuration of the entire backend */
    protected $config;
    /** @var array The full configuration of the current entity */
    protected $entity;
    /** @var Request The instance of the current Symfony request */
    protected $request;
    /** @var EntityManager The Doctrine entity manager for the current entity */
    protected $em;

    /**
     * @var UserPasswordEncoderInterface
     */
    protected $encoder;

    /**
     * AdminController constructor.
     *
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public function createNewFavorEntity()
    {
        $favorRequest = $this->request->get('favor');
        if (!is_null($favorRequest)) {
            $favor = new Favor();
            $favor->setTitle($favorRequest['title']);
            $favor->setContent($favorRequest['content']);
            $favor->setPlaceLimit($favorRequest['placeLimit']);
            $favor->setDateStart(new \DateTime($favorRequest['dateStart']['year'] . '-' . $favorRequest['dateStart']['month'] . '-' . $favorRequest['dateStart']['day']));
            $favor->setDateEnd(new \DateTime($favorRequest['dateEnd']['year'] . '-' . $favorRequest['dateEnd']['month'] . '-' . $favorRequest['dateEnd']['day']));
            $favor->setStatus((int)$favorRequest['status']);

            if (array_key_exists('users', $favorRequest) && count($favorRequest['users'])) {
                $userRepo = $this->em->getRepository(User::class);
                foreach ($favorRequest['users'] as $favorUser) {
                    $user = $userRepo->find($favorUser['user']);
                    $userFavor = new UserFavor();
                    $userFavor->setUser($user);
                    $userFavor->setFavor($favor);
                    $userFavor->setStatus($favorUser['status']);
                    $userFavor->setIsOwner($favorUser['isOwner'] ?? 0);
                    $favor->addUser($userFavor);
                    $user->addFavor($userFavor);

                    $this->em->persist($user);
                    $this->em->persist($userFavor);
                }
            }

            if (array_key_exists('category', $favorRequest)) {
                $category = $this->em->getRepository(Category::class)->find($favorRequest['category']);
                $favor->setCategory($category);
            }

            $this->em->persist($favor);
            $this->em->flush();

            return $favor;
        }
    }

    public function createNewUserEntity()
    {
        $userRequest = $this->request->get('user');
        if (!is_null($userRequest)) {
            $user = new User();
            $user->setEmail($userRequest['email'])
                ->setPassword($this->encoder->encodePassword($user, $userRequest['password']))
                ->setLastname($userRequest['lastname'])
                ->setFirstname($userRequest['firstname'])
                ->setBirthdate(new \DateTime($userRequest['birthdate']['date']['year'] . '-' . $userRequest['birthdate']['date']['month'] . '-' . $userRequest['birthdate']['date']['day']))
                ->setPhone($userRequest['phone']);

            if (array_key_exists('picture', $userRequest)) {
                $picture = $this->em->getRepository(Picture::class)->find($userRequest['picture']);
                $user->setPicture($picture);
            }

            if (array_key_exists('favors', $userRequest) && count($userRequest['favors'])) {
                $favorRepo = $this->em->getRepository(Favor::class);
                foreach ($userRequest['favors'] as $favorUser) {
                    $favor = $favorRepo->find($favorUser['favor']);
                    $userFavor = new UserFavor();
                    $userFavor->setUser($user);
                    $userFavor->setFavor($favor);
                    $userFavor->setStatus($favorUser['status']);
                    $userFavor->setIsOwner($favorUser['isOwner'] ?? 0);
                    $favor->addUser($userFavor);
                    $user->addFavor($userFavor);

                    $this->em->persist($favor);
                    $this->em->persist($userFavor);
                }
            }

            $this->em->persist($user);
            $this->em->flush();

            return $user;
        }
    }

    public function updateFavorEntity($favor) {
        if (count($favor->getUsers())) {
            foreach ($favor->getUsers() as $user) {
                $user->setFavor($favor);
                $this->em->persist($user);
                $this->em->flush();
            }
        }
    }

    public function updateUserEntity($user) {
        if (count($user->getFavors())) {
            foreach ($user->getFavors() as $favor) {
                $favor->setUser($user);
                $this->em->persist($favor);
                $this->em->flush();
            }
        }
    }
}