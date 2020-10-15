<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-17
 * Time: 11:04
 */

namespace App\Tests\Service;

use App\Entity\User;
use App\Form\RegisterFormType;
use App\Tests\TestHelper;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Class AuthenticationServiceTest
 * @package App\Tests\Service
 */
class AuthenticationServiceTest extends WebTestCase
{

    protected function setUp()
    {
        parent::setUp();
        $testHelper = new TestHelper();
        $testHelper->createTestUser();
        $testHelper->createTestUser(true);
    }

    public function testHandleLoginFormSubmission() {
        self::bootKernel();
        $container = self::$container;
        $authenticationService = $container->get('App\Service\AuthenticationService');

        $user = new User();
        $user->setLastname('Toulouze')
            ->setFirstname('Simon')
            ->setPassword(TestHelper::PASSWORD)
            ->setEmail(TestHelper::EMAIL)
            ->setBirthdate(new \DateTime('1993-08-20 17:00:00'))
            ->setPhone('0611846901');

        //Right credentials, should pass
        $result = $authenticationService->handleLoginFormSubmission($user);

        $this->assertInstanceOf(User::class, $result);

        $user->setPassword('abcd');
        //Wrong credentials, should throw an exception
        $this->expectException(\Exception::class);
        $authenticationService->handleLoginFormSubmission($user);
    }

    public function testHandleRegisterFormSubmission() {
        self::bootKernel();
        $container = self::$container;
        $authenticationService = $container->get('App\Service\AuthenticationService');
        $formService = $container->get('form.factory');

        $user = new User();
        $form = $formService->create(RegisterFormType::class, $user);
        $data = [
            'email' => 'simon.toulouze3@gmail.com',
            'password' => 'abcd',
            'phone' => '0601010101',
            'birthdate' => '1993-08-20 17:00:00',
            'lastname' => 'Toulouze',
            'firstname' => 'Simon',
        ];
        $form->submit($data);

        $result = $authenticationService->handleRegisterFormSubmission($data, $user);

        $this->assertInstanceOf(User::class, $result);

        // Email already exists, should throw exception
        $data['email'] = TestHelper::EMAIL;
        $newForm = $formService->create(RegisterFormType::class, $user);
        $newForm->submit($data);

        $this->expectException(\Exception::class);
        $authenticationService->handleRegisterFormSubmission($data, $user);
    }
}