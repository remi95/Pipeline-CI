<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-03-27
 * Time: 13:20
 */

namespace App\Controller;

use Doctrine\ORM\Mapping\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * Class ApiController
 * @package App\Controller
 */
class ApiController extends AbstractController
{

    /**
     * @var integer HTTP status code - 200 (OK) by default
     */
    protected $statusCode = 200;

    /**
     * Gets the value of statusCode.
     *
     * @return integer
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * Sets the value of statusCode.
     *
     * @param integer $statusCode the status code
     *
     * @return self
     */
    protected function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;

        return $this;
    }

    /**
     * Returns a JSON response
     *
     * @param array $data
     * @param array $headers
     *
     * @return JsonResponse
     */
    public function response($data, $headers = [])
    {
        return new JsonResponse($data, $this->getStatusCode(), $headers);
    }

    /**
     * Sets an error message and returns a JSON response
     *
     * @param string $errors
     * @param        $headers
     *
     * @return JsonResponse
     */
    public function respondWithErrors($errors, $headers = [])
    {
        $data = $this->formattedResponse([], $errors);

        return new JsonResponse($data, $this->getStatusCode(), $headers);
    }


    /**
     * Returns a successful JSON response
     *
     * @param string|Entity|array $success
     * @param                     $headers
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function respondWithSuccess($success, $headers = [])
    {
        if (!is_string($success) && !is_array($success)) {
            try {
                $success = [$this->normalizeEntityWithGroup($success)];
            } catch (\Exception $e) {
                return $this->respondValidationError($e->getMessage());
            }
        } else if (is_array($success)) {
            try {
                $successNormalized = [];
                foreach ($success as $entity) {
                    $successNormalized[] = $this->normalizeEntityWithGroup($entity);
                }
                $success = $successNormalized;
            } catch (\Exception $e) {}
        }
        $data = $this->formattedResponse($success, null);

        return new JsonResponse($data, $this->getStatusCode(), $headers);
    }

    /**
     * @param array   $success
     * @param integer $currentPage
     * @param integer $totalItems
     * @param array $header
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function respondWithPagerSuccess($success, $currentPage, $totalItems, $header = []) {
        $successResponse = $this->respondWithSuccess($success, $header);
        $data = json_decode($successResponse->getContent());
        $data->currentPage = $currentPage;
        $data->totalItems = $totalItems;
        $data->itemsPerPage = 20;
        $data->totalPages = ceil($totalItems / 20);
        $successResponse->setData($data);

        return $successResponse;
    }


    /**
     * Returns a 401 Unauthorized http response
     *
     * @param string $message
     *
     * @return JsonResponse
     */
    public function respondUnauthorized($message = 'Not authorized!')
    {
        return $this->setStatusCode(401)->respondWithErrors($message);
    }

    /**
     * Returns a 422 Unprocessable Entity
     *
     * @param string $message
     *
     * @return JsonResponse
     */
    public function respondValidationError($message = 'Validation errors')
    {
        return $this->setStatusCode(422)->respondWithErrors($message);
    }

    /**
     * Returns a 404 Not Found
     *
     * @param string $message
     *
     * @return JsonResponse
     */
    public function respondNotFound($message = 'Not found!')
    {
        return $this->setStatusCode(404)->respondWithErrors($message);
    }

    /**
     * Returns a 201 Created
     *
     * @param array $data
     *
     * @return JsonResponse
     */
    public function respondCreated($data = [])
    {
        return $this->setStatusCode(201)->response($data);
    }

    // this method allows us to accept JSON payloads in POST requests
    // since Symfony 4 doesn’t handle that automatically:

    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Request
     */
    protected function transformJsonBody(\Symfony\Component\HttpFoundation\Request $request)
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return $request;
        }

        $request->request->replace($data);

        return $request;
    }

    /**
     * @param Entity|UserInterface $entity
     *
     * @return array|\ArrayObject|bool|float|int|mixed|string|null
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function normalizeEntityWithGroup($entity) {
        $normalizer = new GetSetMethodNormalizer();
        $dateNormalizer = new DateTimeNormalizer();
        $serializer = new Serializer([$dateNormalizer, $normalizer]);

        return $serializer->normalize($entity, 'json', [
            'circular_reference_limit' => 0,
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);
    }


    /**
     * @param array|string $results
     * @param string $error
     *
     * @return array
     */
    public function formattedResponse($results, $error = null) {
        return [
            'statusCode'  => $this->getStatusCode(),
            'results' => $results,
            'error' => $error
        ];
    }
}