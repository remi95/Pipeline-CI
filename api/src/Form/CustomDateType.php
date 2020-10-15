<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-03
 * Time: 12:25
 */

namespace App\Form;

use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CustomDateType extends DateTimeType
{
    public function configureOptions(OptionsResolver $resolver)
    {
        // Set the defaults from the DateTimeType we're extending from
        parent::configureOptions($resolver);

        // Override: Go back 20 years and add 20 years
        $resolver->setDefault('years', range(date('Y') - 100, date('Y') + 10));
    }
}