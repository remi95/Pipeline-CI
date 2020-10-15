<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-16
 * Time: 10:49
 */

namespace App\Form;

use App\Entity\Request as Req;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RequestFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('content')
            ->add('dateStart')
            ->add('dateEnd')
            ->add('pictures')
            ->add('cities')
            ->add('user')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Req::class,
        ]);
    }
}
