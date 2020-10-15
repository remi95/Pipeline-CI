<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-16
 * Time: 11:23
 */

namespace App\Service;

use App\Entity\City;
use App\Entity\Comment;
use App\Entity\Favor;
use App\Entity\User;
use App\Entity\UserFavor;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class FavorService
 * @package App\Service
 */
class FavorService
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
     * @param Request $request
     *
     * @return mixed
     * @throws \Exception
     */
    public function getFavorsFromRequest(Request $request) {
        $params = $request->query;
        if (!$params->has('department')) {
            throw new \Exception('Missing department parameter');
        }
        $favorRepository = $this->em->getRepository(Favor::class);

        return $favorRepository->getFilteredFavors($params->all());
    }

    /**
     * @param int $id
     *
     * @return Favor
     * @throws \Exception
     */
    public function getFavor($id) {
        $favor = $this->em->getRepository(Favor::class)
            ->find($id)
        ;

        if (is_null($favor)) {
            throw new \Exception('No favor found with this id');
        }

        return $favor;
    }


    /**
     * @param int      $id
     * @param User|int $user
     * @param bool     $isApplication
     * @param bool     $accept
     * @param User     $currentUser
     *
     * @throws \Exception
     * @return string
     */
    public function addUserToFavor($id, $user, $isApplication = false, $accept = false, $currentUser = null) {
        try {
            $favor = $this->em->getRepository(Favor::class)
                ->find($id);
            ;

            if (is_null($favor)) {
                throw new \Exception('No favor found with this id');
            }

            if ($isApplication) {
                $user = $this->em->getRepository(User::class)->find($user);
                $userFavorRepository = $this->em->getRepository(UserFavor::class);
                $userFavor = $userFavorRepository->findOneBy([
                    'favor' => $id,
                    'user' => $user
                ]);
                $currentUserHasFavor = $userFavorRepository->findOneBy([
                    'favor' => $id,
                    'user' => $currentUser->getId()
                ]);

                // If the user is hasn't got any application to the favor of is not the owner of the favor -> throw error
                if (is_null($currentUserHasFavor) || !$currentUserHasFavor->getIsOwner()) {
                    throw new \Exception("The currently connected user is not the owner of the favor");
                }

                $userFavor->setStatus((bool) $accept ? 1 : 0);
            } else {
                $userFavor = new UserFavor();
                $userFavor->setStatus(2);
            }
            $userFavor->setUser($user);
            $userFavor->setFavor($favor);
            $userFavor->setIsOwner(false);
            $favor->addUser($userFavor);
            $user->addFavor($userFavor);

            $this->em->persist($favor);
            $this->em->persist($user);
            $this->em->persist($userFavor);

            $this->em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Oups, something went wrong. Try again later (error: '.$e->getMessage().')');
        }

        return 'ok';
    }

    /**
     * @param      $formData
     * @param Favor $favor
     *
     * @return Favor
     * @throws \Exception
     */
    public function handleFavorFormSubmission($formData, Favor $favor): ?Favor
    {
        foreach ($formData['cities'] as $city) {
            $cityToAdd = $this->em->getRepository(City::class)->findOneBy(['name' => $city['name'], 'postalCode' => $city['postalCode']]);
            $favor->addCity($cityToAdd);
        }

        $favor->setDateStart(new \DateTime($formData['dateStart']));
        $favor->setDateEnd(new \DateTime($formData['dateEnd']));
        $favor->setCategory($formData['category']);
        $favor->setStatus(2);

        if (array_key_exists('pictures', $formData)) {
            foreach ($formData['pictures'] as $picture) {
                $favor->addPicture($picture);
            }
        }

        $this->em->persist($favor);
        $this->em->flush();

        return $favor;
    }

    /**
     * @param string $content
     * @param int    $favorId
     * @param User   $author
     *
     * @return Comment
     * @throws \Exception
     */
    public function commentFavor(string $content, int $favorId, User $author) {
        $favor = $this->em->getRepository(Favor::class)
            ->find($favorId);
        if (is_null($favor)) {
            throw new \Exception ("No favor found for the id : {$favorId}");
        }
        $comment = new Comment();
        $comment->setUser($author)
            ->setFavor($favor)
            ->setContent($content);

        $favor->addComment($comment);
        $author->addComment($comment);

        $this->em->persist($comment);
        $this->em->flush();

        return $comment;
    }

    /**
     * @param string $text
     *
     * @return array
     */
    public function autocompleteFromRequest(string $text) {
        return $this->em->getRepository(Favor::class)->getAutocomplete($text);
    }


    /**
     * @param Favor $favor
     * @param UserInterface $user
     */
    public function createOwner(Favor $favor, UserInterface $user) {
        if ($user) {
            $owner = new UserFavor();
            $owner
              ->setUser($user)
              ->setIsOwner(true)
              ->setFavor($favor)
              ->setStatus(1);

            $favor->addUser($owner);
        }
    }
}