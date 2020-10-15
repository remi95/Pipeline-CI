<?php

namespace App\Controller;

use App\Entity\Picture;
use App\Form\RequestFormType;
use App\Service\RequestService;
use App\Service\FormService;
use App\Entity\Request as Req;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UploadService;

/**
 * Class ReqController
 * @package App\Controller
 */
class RequestController extends ApiController
{
    /**
     * @Route("/request", name="list_requests", methods={"GET"})
     * @param Request        $request
     * @param RequestService $requestService
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getRequests(Request $request, RequestService $requestService)
    {
        try {
            $favors = $requestService->getRequestsFromRequest($request);
            $currentPage = $request->query->has('page') ? $request->query->get('page') : 1;

            return $this->respondWithPagerSuccess($favors['results'], $currentPage, $favors['totalCount']);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/request/{id}", name="request_details", requirements={"id"="\d+"})
     * @param RequestService $requestService
     * @param int            $id
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getRequest(RequestService $requestService, $id)
    {
        try {
            $request = $requestService->getRequest($id);

            return $this->respondWithSuccess($request);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/user/requests", name="list_user_requests")
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getUserRequests()
    {
        $user = $this->getUser();
        try {
            return $this->respondWithSuccess($user->getRequests());
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/request", name="create_request", methods={"POST"})
     * @param Request $request
     * @param UploadService $uploader
     * @param FormService $formService
     * @param RequestService $requestService
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     * @throws \Exception
     */
    public function createRequest(Request $request, UploadService $uploader, FormService $formService, RequestService $requestService)
    {
        $data = $request->request->all();

        if (!$request->request->has('title')) {
            return $this->respondWithErrors('Missing required \'title\' parameter in POST request body');
        }
        if (!$request->request->has('content')) {
            return $this->respondWithErrors('Missing required \'content\' parameter in POST request body');
        }
        if (!$request->request->has('dateStart')) {
            return $this->respondWithErrors('Missing required \'date_start\' parameter in POST request body');
        }
        if (!$request->request->has('dateEnd')) {
            return $this->respondWithErrors('Missing required \'date_end\' parameter in POST request body');
        }
        if (!$request->request->has('cities')) {
            return $this->respondWithErrors('Missing required \'cities\' parameter in POST request body');
        }

        if ($request->files->has('pictures')) {
            $pictures = [];
            foreach ($request->files->get('pictures') as $picture) {
                /** @var Picture $uploadedPicture */
                $uploadedPicture = $uploader
                    ->upload(
                        $picture,
                        $this->getParameter('images_uploaded_directory'),
                        $this->getParameter('images_uploaded_read_directory')
                    );
                array_push($pictures, $uploadedPicture);
            }
            $data['pictures'] = array_filter($pictures, function($picture) { return !is_null($picture); });
        }

        $data['cities'] = json_decode($data['cities'], true);
        foreach ($data['cities'] as $city) {
            $formService->checkCity($city);
        }

        $data['user'] = $this->getUser();

        $req = new Req();

        $form = $this->createForm(RequestFormType::class, $req);

        try {
            $form->submit($data);
        } catch (\Exception $e) {
            return $this->respondValidationError("Missing fields");
        }

        try {
            $req = $requestService->handleRequestFormSubmission($data, $req);
        } catch (\Exception $e) {
            return $this->respondValidationError($e->getMessage());
        }

        return $this->respondWithSuccess($req);
    }

    /**
     * @Route("/api/request/form", name="request_form", methods={"GET"})
     * @param FormService $formService
     *
     * @return JsonResponse
     * @throws \Exception
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function requestForm(FormService $formService)
    {
        $form = [];
        $title = $formService->generateField('title', 'Titre', 'text');
        $content = $formService->generateField('content', 'Contenu', 'textarea');
        $dateStart = $formService->generateField('dateStart', 'Date de début', 'date');
        $dateEnd = $formService->generateField('dateEnd', 'Date de fin', 'date');
        $pictures = $formService->generateField('pictures[]', 'Photos', '[file]', null, null, false);
        $cities = $formService->generateField('cities', 'Villes', 'custom');

        $categories = $formService->getCategories();
        $category = $formService->generateField('category', 'Catégorie', 'select', null, null, true, $categories);

        array_push($form, $title, $content, $dateStart, $dateEnd, $pictures, $cities, $category);

        return $this->respondWithSuccess($form);
    }
}
