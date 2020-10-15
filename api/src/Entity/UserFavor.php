<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserFavorRepository")
 * @ORM\Table(name="user_favor")
 */
class UserFavor
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isOwner;

    /**
     * @ORM\Column(type="integer")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="favors")
     * @ORM\JoinColumn(nullable=true)
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Favor", inversedBy="users")
     * @ORM\JoinColumn(nullable=true)
     */
    private $favor;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIsOwner(): ?bool
    {
        return $this->isOwner;
    }

    public function setIsOwner(bool $isOwner): self
    {
        $this->isOwner= $isOwner;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getFavor(): ?Favor
    {
        return $this->favor;
    }

    public function setFavor(?Favor $favor): self
    {
        $this->favor = $favor;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        if (is_null($status)) {
            $this->status = 2;
        } else {
            $this->status = $status;
        }

        return $this;
    }

    public function __toString()
    {
        if (strpos($_SERVER['REQUEST_URI'], 'entity=Favor') !== false) {
            return $this->getUser()->getEmail();
        } else if (strpos($_SERVER['REQUEST_URI'], 'entity=User') !== false) {
            return $this->getFavor()->getTitle();
        }

        return (string) $this->getId();
    }
}