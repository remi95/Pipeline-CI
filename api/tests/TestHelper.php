<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-17
 * Time: 15:25
 */

namespace App\Tests;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class TestHelper extends WebTestCase
{
    const ADMIN_EMAIL = 'test_user@gmail.com';
    const ADMIN_PASSWORD = 'Azertyuiop1';
    const EMAIL = 'test_user+1@gmail.com';
    const PASSWORD = 'Azertyuiop1';
    static $client = null;

    public function __construct()
    {
        parent::__construct();
        if (is_null(self::$client)) {
            self::$client = static::createClient();
        }
    }

    public function createTestUser($isAdmin = false)
    {
        self::bootKernel();
        $container = self::$container;
        $em = $container->get('doctrine.orm.entity_manager');
        $passwordEncoder = $container->get(UserPasswordEncoderInterface::class);

        $user = new User();
        $user->setEmail($isAdmin ? self::ADMIN_EMAIL : self::EMAIL);
        $user->setPassword($passwordEncoder->encodePassword($user, $isAdmin ? self::ADMIN_PASSWORD : self::PASSWORD));
        $user->setIsAdmin($isAdmin);
        $user->setLastname('Toulouze');
        $user->setFirstname('Simon');
        $user->setPhone('0601010101');
        $user->setBirthdate(new \DateTime('1993-08-20 17:00:00'));

        $roles = [];
        if ($isAdmin) {
            array_push($roles, 'ROLE_ADMIN');
        }
        $user->setRoles($roles);

        $em->persist($user);
        $em->flush();
    }
}