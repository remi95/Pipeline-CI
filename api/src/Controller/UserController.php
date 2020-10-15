<?php

namespace App\Controller;

use App\Entity\Picture;
use App\Entity\User;
use App\Form\LoginFormType;
use App\Form\RegisterFormType;
use App\Service\AuthenticationService;
use App\Service\FormService;
use App\Service\UploadService;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class UserController
 * @package App\Controller
 */
class UserController extends ApiController
{

    /**
     * @Route("/api/user", name="user_from_token", methods={"GET"})
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getUserFromToken()
    {
        return $this->respondWithSuccess($this->getUser());
    }

    /**
     * @Route("/api/user", name="edit", methods={"POST"})
     *
     * @param Request     $request
     * @param UserService $userService
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function editUser(Request $request, UserService $userService)
    {
        $user = $this->getUser();
        $data = $request->request->all();
        if ($request->files->has('picture')) {
            $data['picture'] = $request->files->get('picture');
        }
        $uploadDirectory = $this->getParameter('images_uploaded_directory');
        $uploadReadDirectory = $this->getParameter('images_uploaded_read_directory');
        $newUser = $userService->editUser($user, $data, $uploadDirectory, $uploadReadDirectory);

        return $this->respondWithSuccess($newUser);
    }
}