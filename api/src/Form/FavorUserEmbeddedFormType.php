<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\UserFavor;
use App\Repository\UserRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FavorUserEmbeddedFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('user', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'email',
                'query_builder' => function(UserRepository $userRepo) {
                    return $userRepo->createQueryBuilder('u')
                        ->orderBy('u.email', 'ASC');
                }
            ])
            ->add('isOwner')
            ->add('status', ChoiceType::class, [
                'choices' => [
                    'Inactif' => '0',
                    'Actif' => '1',
                    'En attente de validation' => '2',
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserFavor::class,
        ]);
    }
}
