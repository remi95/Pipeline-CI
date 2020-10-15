<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-10
 * Time: 12:41
 */

namespace App\Service;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class AuthenticationService
 * @package App\Service
 */
class AuthenticationService
{
    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var UserPasswordEncoderInterface $encoder
     */
    private $encoder;

    /**
     * @var JWTTokenManagerInterface $JWTManager
     */
    private $JWTManager;

    /**
     * AuthenticationService constructor.
     *
     * @param EntityManagerInterface       $em
     * @param UserPasswordEncoderInterface $encoder
     * @param JWTTokenManagerInterface     $JWTManager
     */
    public function __construct(EntityManagerInterface $em, UserPasswordEncoderInterface $encoder, JWTTokenManagerInterface $JWTManager)
    {
        $this->em = $em;
        $this->encoder = $encoder;
        $this->JWTManager = $JWTManager;
    }


    /**
     * @param      $formData
     * @param User $user
     *
     * @return User
     * @throws \Exception
     */
    public function handleRegisterFormSubmission($formData, User $user): ?User
    {
        $user->setBirthdate(new \DateTime($formData['birthdate']));

        if (array_key_exists('picture', $formData)) {
            $user->setPicture($formData['picture']);
        }

        $userExists = $this->em->getRepository(User::class)->findBy(["email" => $user->getEmail()]);
        if (!empty($userExists)) {
            throw new \Exception("This email address already exists");
        }

        $user->setPassword($this->encoder->encodePassword($user, $user->getPassword()));
        $user->setApiToken($this->JWTManager->create($user));
        $user->setIsAdmin(false);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    /**
     * @param User $user
     *
     * @return User|null
     * @throws \Exception
     */
    public function handleLoginFormSubmission(User $user): ?User
    {
        $userExists = $this->em->getRepository(User::class)->findOneBy([
            'email' => $user->getEmail(),
        ]);

        if (!is_null($userExists) && $this->encoder->isPasswordValid($userExists, $user->getPassword())) {
            $userExists->setApiToken($this->JWTManager->create($userExists));
            $this->em->persist($userExists);
            $this->em->flush();

            return $userExists;
        }

        throw new \Exception("Wrong credentials");
    }
}