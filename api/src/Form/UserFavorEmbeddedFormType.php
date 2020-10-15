<?php

namespace App\Form;

use App\Entity\Favor;
use App\Entity\User;
use App\Entity\UserFavor;
use App\Repository\FavorRepository;
use App\Repository\UserRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserFavorEmbeddedFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('favor', EntityType::class, [
                'class' => Favor::class,
                'choice_label' => 'title',
                'query_builder' => function(FavorRepository $favorRepo) {
                    return $favorRepo->createQueryBuilder('f')
                        ->orderBy('f.title', 'ASC');
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
