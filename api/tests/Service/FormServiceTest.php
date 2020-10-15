<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-17
 * Time: 11:04
 */

namespace App\Tests\Service;

use App\Entity\Favor;
use App\Service\FormService;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class FormServiceTest extends KernelTestCase
{
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    private $entityManager;

    protected function setUp(): void
    {
        parent::setUp();
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // doing this is recommended to avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }

    public function testGenerateField() {
        $formService = new FormService($this->entityManager);

        $result = $formService->generateField("test", "Test", "text", null, null, false);
        $shouldBeEqualTo = new \stdClass();
        $shouldBeEqualTo->key = "test";
        $shouldBeEqualTo->label = "Test";
        $shouldBeEqualTo->type = "text";
        $shouldBeEqualTo->validation = null;
        $shouldBeEqualTo->hint = null;
        $shouldBeEqualTo->required = false;
        $shouldBeEqualTo->select = null;

        $this->assertEquals($shouldBeEqualTo, $result);
    }

    public function testGetCategories()
    {
        $formService = new FormService($this->entityManager);

        $result = $formService->getCategories();
        $favors = $this->entityManager->getRepository(Favor::class)->findAll();
        if (count($favors) > 0) {
            $this->assertNotEmpty($result);
        } else {
            $this->assertEmpty($result);

        }
    }
}