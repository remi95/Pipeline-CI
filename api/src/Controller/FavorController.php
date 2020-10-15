<?php

namespace App\Controller;

use App\Service\FavorService;
use App\Service\FormService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Category;
use App\Entity\Favor;
use App\Entity\User;
use App\Entity\Picture;
use App\Service\UploadService;
use App\Form\FavorFormType;
use App\Service\RequestService;

/**
 * Class FavorController
 * @package App\Controller
 */
class FavorController extends ApiController
{
    /**
     * @Route("/favor", name="list_favors", methods={"GET"})
     * @param Request      $request
     * @param FavorService $favorService
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getFavors(Request $request, FavorService $favorService)
    {
        try {
            $favors = $favorService->getFavorsFromRequest($request);
            $currentPage = $request->query->has('page') ? $request->query->get('page') : 1;

            return $this->respondWithPagerSuccess($favors['results'], $currentPage, $favors['totalCount']);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/favor/{id}", name="favor_details", requirements={"id"="\d+"})
     * @param FavorService $favorService
     * @param int          $id
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getFavor(FavorService $favorService, $id)
    {
        try {
            $favor = $favorService->getFavor($id);

            return $this->respondWithSuccess($favor);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/favor/apply/{id}", name="favor_apply", requirements={"id"="\d+"})
     * @param FavorService $favorService
     * @param int          $id
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function applyToFavor(FavorService $favorService, $id)
    {
        try {
            $success = $favorService->addUserToFavor($id, $this->getUser());

            return $this->respondWithSuccess($success);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route(
     *     "/api/favor/accept/{favorId}/{userId}",
     *     name="favor_accept",
     *     requirements={"favorId"="\d+", "userId"="\d+"},
     *     methods={"POST"}
     * )
     * @param Request      $request
     * @param FavorService $favorService
     * @param int          $favorId
     * @param int          $userId
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function acceptApplianceToFavor(Request $request, FavorService $favorService, $favorId, $userId)
    {
        if (!$request->request->has('accepted')) {
            return $this->respondWithErrors('Missing required \'accepted\' parameter in POST request body');
        }
        try {
            $success = $favorService->addUserToFavor($favorId, $userId, true, $request->request->get('accepted'), $this->getUser());

            return $this->respondWithSuccess($success);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/user/favors", name="list_user_favors")
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getUserFavors()
    {
        $user = $this->getUser();
        try {
            return $this->respondWithSuccess($user->getFavors());
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/favor/{id}/comment", name="favor_comment", requirements={"id"="\d+"}, methods={"POST"})
     *
     * @param Request      $request
     * @param FavorService $favorService
     * @param int          $id
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function commentFavor(Request $request, FavorService $favorService, int $id)
    {
        $user = $this->getUser();
        if (!$request->request->has('content')) {
            return $this->respondWithErrors('Missing required \'content\' parameter in POST request body');
        }
        try {
            $comment = $favorService->commentFavor($request->request->get('content'), $id, $user);
            return $this->respondWithSuccess($comment);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }
    }

    /**
     * @Route("/api/autocomplete", name="favor_autocomplete", methods={"POST"})
     *
     * @param Request      $request
     * @param FavorService $favorService
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function autocompleteFavor(Request $request, FavorService $favorService) {
        if (!$request->request->has('text')) {
            return $this->respondWithErrors('Missing required \'text\' parameter in POST request body');
        }
        $results = $favorService->autocompleteFromRequest($request->request->get('text'));

        return $this->respondWithSuccess($results);
    }

    /**
     * @Route("/api/favor", name="create_favor", methods={"POST"})
     * @param Request $request
     * @param UploadService         $uploader
     *
     * @return JsonResponse
     * @throws \Exception
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function createFavor(Request $request, UploadService $uploader, FormService $formService, FavorService $favorService)
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
        if (!$request->request->has('placeLimit')) {
            return $this->respondWithErrors('Missing required \'placeLimit\' parameter in POST request body');
        }
        if (!$request->request->has('category')) {
            return $this->respondWithErrors('Missing required \'category\' parameter in POST request body');
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

        $category = $formService->findCategory($data['category']);
        $data['category'] = $category;

        $favor = new Favor();
        $form = $this->createForm(FavorFormType::class, $favor);

        try {
            $form->submit($data);
        } catch (\Exception $e) {
            return $this->respondValidationError("Missing fields");
        }

        try {
          $favorService->createOwner($favor, $this->getUser());
          $favor = $favorService->handleFavorFormSubmission($data, $favor);
        } catch (\Exception $e) {
            return $this->respondValidationError($e->getMessage());
        }

        return $this->respondWithSuccess($favor);
    }

    /**
     * @Route("/api/favor/form", name="favor_form", methods={"GET"})
     * @param FormService $formService
     *
     * @return JsonResponse
     * @throws \Exception
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function favorForm(FormService $formService)
    {
        $form = [];
        $title = $formService->generateField('title', 'Titre', 'text');
        $content = $formService->generateField('content', 'Contenu', 'textarea');
        $dateStart = $formService->generateField('dateStart', 'Date de début', 'date');
        $dateEnd = $formService->generateField('dateEnd', 'Date de fin', 'date');
        $placeLimit = $formService->generateField('placeLimit', 'Nombre de place', 'number');
        $cities = $formService->generateField('cities', 'Villes', 'custom');
        $pictures = $formService->generateField('pictures[]', 'Photos', '[file]');

        $categories = $formService->getCategories();
        $category = $formService->generateField('category', 'Catégorie', 'select', null, null, true, $categories);

        array_push($form, $title, $content, $dateStart, $dateEnd, $placeLimit, $cities, $category, $pictures);

        return $this->respondWithSuccess($form);
    }
}
