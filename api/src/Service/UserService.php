<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-19
 * Time: 12:53
 */

namespace App\Service;


use App\Entity\Picture;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserService
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
     * @var UploadService $uploader
     */
    private $uploader;

    /**
     * UserService constructor.
     *
     * @param EntityManagerInterface       $em
     * @param UserPasswordEncoderInterface $encoder
     * @param UploadService                $uploader
     */
    public function __construct(EntityManagerInterface $em, UserPasswordEncoderInterface $encoder, UploadService $uploader)
    {
        $this->em = $em;
        $this->encoder = $encoder;
        $this->uploader = $uploader;
    }

    public function editUser(User $user, array $data, $uploadDirectory, $uploadReadDirectory) {
        if (array_key_exists('picture', $data)) {
            /** @var Picture $uploadedPicture */
            $uploadedPicture = $this->uploader
                ->upload(
                    $data['picture'],
                    $uploadDirectory,
                    $uploadReadDirectory
                );
            $user->setPicture($uploadedPicture);
        }
        if (array_key_exists('phone', $data)) {
            $user->setPhone($data['phone']);
        }
        if (array_key_exists('password', $data)) {
            $user->setPassword($this->encoder->encodePassword($user, $data['password']));
        }

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}