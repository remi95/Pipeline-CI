<?php
/**
 * Created by PhpStorm.
 * User: simontoulouze
 * Date: 2020-04-12
 * Time: 17:03
 */

namespace App\Service;


use App\Entity\Picture;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

/**
 * Class UploadService
 * @package App\Service
 */
class UploadService
{
    /** @var SluggerInterface $slugger */
    private $slugger;

    /** @var EntityManagerInterface $em */
    private $em;

    /**
     * UploadService constructor.
     *
     * @param SluggerInterface $slugger
     * @param EntityManagerInterface $em
     */
    public function __construct(SluggerInterface $slugger, EntityManagerInterface $em)
    {
        $this->slugger = $slugger;
        $this->em = $em;
    }

    /**
     * @param UploadedFile $picture
     * @param string       $uploadDirectory
     * @param string       $readDirectory
     *
     * @return Picture|null
     */
    public function upload(UploadedFile $picture, $uploadDirectory, $readDirectory): ?Picture
    {
        try {
            $originalFilename = pathinfo($picture->getClientOriginalName(), PATHINFO_FILENAME);
            // this is needed to safely include the file name as part of the URL
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $picture->guessExtension();

            // Move the file to the directory where brochures are stored
            $picture->move(
                $uploadDirectory,
                $newFilename
            );

            // updates the 'brochureFilename' property to store the PDF file name
            // instead of its contents
            $uploadedPicture = new Picture();
            $uploadedPicture->setName($newFilename);
            $uploadedPicture->setOriginalName($originalFilename);
            $uploadedPicture->setPath($readDirectory . '/' . $newFilename);

            $this->em->persist($uploadedPicture);
            $this->em->flush();

            return $uploadedPicture;
        } catch (\Exception $e) {
            return null;
        }
    }
}