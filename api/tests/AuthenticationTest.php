<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-17
 * Time: 14:57
 */

namespace App\Tests;


use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthenticationTest extends WebTestCase
{
    /** @var KernelBrowser $client */
    private $client;

    protected function setUp()
    {
        parent::setUp();
        $testHelper = new TestHelper();
        $testHelper->createTestUser();
        $testHelper->createTestUser(true);
        if (is_null($this->client)) {
            $this->client = TestHelper::$client;
        }
    }

    protected function initAuthenticatedClient()
    {
        $this->client->request(
            'POST',
            '/auth/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => TestHelper::EMAIL,
                'password' => TestHelper::PASSWORD,
            ])
        );

        $data = json_decode($this->client->getResponse()->getContent(), true);

        $this->client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $data['results'][0]['apiToken']));
    }

    protected function initAuthenticatedAdminClient()
    {
        $this->client->request(
            'POST',
            '/auth/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => TestHelper::ADMIN_EMAIL,
                'password' => TestHelper::ADMIN_PASSWORD,

            ])
        );

        $data = json_decode($this->client->getResponse()->getContent(), true);

        $this->client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $data['results'][0]['apiToken']));
    }

    public function testGetTestPage()
    {
        $this->initAuthenticatedClient();
        $this->client->request('GET', '/api/test');

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $this->client->setServerParameter('HTTP_Authorization', '');
        $this->client->request('GET', '/api/test');

        $this->assertEquals(401, $this->client->getResponse()->getStatusCode());
    }

    public function testGetAdminPage()
    {
        // Test with a user that has admin rights
        $this->initAuthenticatedAdminClient();
        $this->client->request('GET', '/admin');
        $this->assertEquals(301, $this->client->getResponse()->getStatusCode());

        // Test with a user that hasn't got admin rights
        $this->initAuthenticatedClient();
        $this->client->request('GET', '/admin');
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }
}