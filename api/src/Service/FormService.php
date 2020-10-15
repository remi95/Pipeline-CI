<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-10
 * Time: 12:34
 */

namespace App\Service;


use App\Entity\Category;
use App\Entity\City;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class FormService
 * @package App\Service
 */
class FormService
{
    /** @var EntityManagerInterface $em */
    private $em;

    /**
     * FavorService constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param string      $key
     * @param string      $label
     * @param string      $type
     * @param string|null $validation
     * @param string|null $hint
     * @param bool        $required
     * @param null $select
     *
     * @return \stdClass
     */
    public function generateField($key, $label, $type, $validation = null, $hint = null, $required = true, $select = null)
    {
        $field = new \stdClass();
        $field->key = $key;
        $field->label = $label;
        $field->type = $type;
        $field->validation = $validation;
        $field->hint = $hint;
        $field->required = $required;
        $field->select = $select;

        return $field;
    }

    public function getCategories()
    {
        /** @var Category[] $cats */
        $cats = $this->em->getRepository(Category::class)->findAll();
        $categories = [];
        foreach ($cats as $cat) {
            $categories[$cat->getId()] = $cat->getName();
        }
        return $categories;
    }

    public function checkCity($city){
        $existingCity = $this->em->getRepository(City::class)->findOneBy(['name' => $city['name']]);
        if (is_null($existingCity)) {
            $newCity = new City();
            $newCity->setName($city['name']);
            $newCity->setPostalCode($city['postalCode']);
            $newCity->setDepartment($city['department']);

            $this->em->persist($newCity);
            $this->em->flush();

            return $newCity;
        }
        return null;
    }

    public function findCategory(string $category){
        $cat = $this->em->getRepository(Category::class)->find($category);
        return $cat;
    }
}