<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-03-27
 * Time: 16:36
 */

namespace App\EventListener;

use App\Controller\ApiController;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;

/**
 * Class AuthenticationSuccessListener
 * @package App\EventListener
 */
class JWTListeners
{

    /**
     * @var EntityManagerInterface
     */
    private $em;


    /**
     * AuthenticationSuccessListener constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param AuthenticationSuccessEvent $event
     *
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     * @throws \Doctrine\Common\Annotations\AnnotationException
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();

        // First of all, we're updating the token with the new one
        $user = $event->getUser();
        $userEntity = $this->em->getRepository(User::class)->findOneBy(
            [
                "email" => $user->getUsername()
            ]
        );
        $userEntity->setApiToken($data["token"]);
        $this->em->persist($userEntity);
        $this->em->flush();

        // Then we're replacing the response by the user, containing the newly created token
        $apiController = new ApiController();
        $userNormalized = $apiController->normalizeEntityWithGroup($user, 'registration');

        // We're formatting the response so it returns always an array or a string
        $userNormalized = [$userNormalized];

        $responseNormalized = $apiController->formattedResponse($userNormalized);
        $data = $responseNormalized;

        $event->setData($data);
    }

    public function onJWTInvalid(JWTInvalidEvent $event) {
        $apiController = new ApiController();
        $responseNormalized = $apiController->respondUnauthorized("Invalid JWT Token, please login again to get a new one");
        $event->setResponse($responseNormalized);
    }

    public function onJWTNotFound(JWTNotFoundEvent $event) {
        $apiController = new ApiController();
        $responseNormalized = $apiController->respondUnauthorized("JWT Token not found, you must be logged in to access the API");
        $event->setResponse($responseNormalized);
    }

    public function onJWTExpired(JWTExpiredEvent $event) {
        $apiController = new ApiController();
        $responseNormalized = $apiController->respondUnauthorized("JWT Token expired, please login again to get a new one");
        $event->setResponse($responseNormalized);
    }
}