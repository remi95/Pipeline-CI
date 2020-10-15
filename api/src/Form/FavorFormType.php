<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-16
 * Time: 11:01
 */

namespace App\Form;

use App\Entity\Favor;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FavorFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('content')
            ->add('dateStart')
            ->add('dateEnd')
            ->add('placeLimit')
            ->add('status')
            ->add('cities')
            ->add('category')
            ->add('pictures')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Favor::class,
        ]);
    }
}
