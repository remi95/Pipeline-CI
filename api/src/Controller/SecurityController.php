<?php

namespace App\Controller;

use App\Entity\Picture;
use App\Entity\User;
use App\Form\LoginFormType;
use App\Form\RegisterFormType;
use App\Service\AuthenticationService;
use App\Service\FormService;
use App\Service\UploadService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class SecurityController
 * @package App\Controller
 */
class SecurityController extends ApiController
{

    /**
     * @Route("/auth/register", name="register", methods={"POST"})
     * @param Request               $request
     * @param AuthenticationService $authenticationService
     * @param UploadService         $uploader
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function register(Request $request, AuthenticationService $authenticationService, UploadService $uploader)
    {
        $data = $request->request->all();

        if ($request->files->has('picture')) {
            /** @var Picture $uploadedPicture */
            $uploadedPicture = $uploader
                ->upload(
                    $request->files->get('picture'),
                    $this->getParameter('images_uploaded_directory'),
                    $this->getParameter('images_uploaded_read_directory')
                );
            $data['picture'] = $uploadedPicture;
        }

        $user = new User();
        $form = $this->createForm(RegisterFormType::class, $user);

        try {
            $form->submit($data);
        } catch (\Exception $e) {
            return $this->respondValidationError("Missing fields");
        }

        try {
            $user = $authenticationService->handleRegisterFormSubmission($data, $user);
        } catch (\Exception $e) {
            return $this->respondValidationError($e->getMessage());
        }

        return $this->respondWithSuccess($user);
    }

    /**
     * @Route("/auth/login", name="login", methods={"POST"})
     * @param Request               $request
     * @param AuthenticationService $authenticationService
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function login(Request $request, AuthenticationService $authenticationService)
    {
        $data = $request->request->all();

        $user = new User();
        $form = $this->createForm(LoginFormType::class, $user);

        try {
            $form->submit($data);
        } catch (\Exception $e) {
            return $this->respondValidationError("Missing fields");
        }

        try {
            $user = $authenticationService->handleLoginFormSubmission($user);
        } catch (\Exception $e) {
            return $this->respondWithErrors($e->getMessage());
        }

        return $this->respondWithSuccess($user);
    }

    /**
     * @param FormService $formService
     *
     * @Route("/auth/register/form", name="register_form", methods={"GET"})
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function registerForm(FormService $formService)
    {
        $fields = [];
        $fields[] = $formService->generateField('email', 'Email', 'email', '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
        $fields[] = $formService->generateField('password', 'Mot de passe', 'password', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$', 'Minimum de 8 caractères avec une majuscule, une minuscule et un chiffre');
        $fields[] = $formService->generateField('lastname', 'Nom', 'text');
        $fields[] = $formService->generateField('firstname', 'Prénom', 'text');
        $fields[] = $formService->generateField('phone', 'Téléphone', 'tel');
        $fields[] = $formService->generateField('birthdate', 'Date de naissance', 'date', '/([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/gm');
        $fields[] = $formService->generateField('picture', 'Photo de profil', 'file');

        return $this->respondWithSuccess($fields);
    }

    /**
     * @param FormService $formService
     *
     * @Route("/auth/login/form", name="login_form", methods={"GET"})
     *
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function loginForm(FormService $formService)
    {
        $fields = [];
        $fields[] = $formService->generateField('email', 'Email', 'email', '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
        $fields[] = $formService->generateField('password', 'Mot de passe', 'password', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$', 'Minimum de 8 caractères avec une majuscule, une minuscule et un chiffre');

        return $this->respondWithSuccess($fields);
    }

    /**
     * @Route("/api/test", name="test", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function test()
    {
        return $this->respondWithSuccess("ok");
    }
}