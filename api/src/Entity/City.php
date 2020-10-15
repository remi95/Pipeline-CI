<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CityRepository")
 * @ORM\HasLifecycleCallbacks
 */
class City
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $postalCode;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Request", inversedBy="cities")
     */
    private $requests;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Favor", mappedBy="cities")
     */
    private $favors;

    /**
     * @ORM\Column(type="integer")
     */
    private $department;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    public function __construct()
    {
        $this->requests = new ArrayCollection();
        $this->favors = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    public function setPostalCode(string $postalCode): self
    {
        $this->postalCode = $postalCode;

        return $this;
    }

    /**
     * @return Collection|Request[]
     */
    public function getRequests(): Collection
    {
        return $this->requests;
    }

    public function addRequest(Request $request): self
    {
        if (!$this->requests->contains($request)) {
            $this->requests[] = $request;
        }

        return $this;
    }

    public function removeRequest(Request $request): self
    {
        if ($this->requests->contains($request)) {
            $this->requests->removeElement($request);
        }

        return $this;
    }

    /**
     * @return Collection|Favor[]
     */
    public function getFavors(): Collection
    {
        return $this->favors;
    }

    public function addFavor(Favor $favor): self
    {
        if (!$this->favors->contains($favor)) {
            $this->favors[] = $favor;
            $favor->addCity($this);
        }

        return $this;
    }

    public function removeFavor(Favor $favor): self
    {
        if ($this->favors->contains($favor)) {
            $this->favors->removeElement($favor);
            $favor->removeCity($this);
        }

        return $this;
    }

    public function getDepartment(): ?int
    {
        return $this->department;
    }

    public function setDepartment(int $department): self
    {
        $this->department = $department;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function __toString()
    {
        return $this->getName();
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps(): void
    {
        $this->setUpdatedAt(new \DateTime('now'));
        if ($this->getCreatedAt() === null) {
            $this->setCreatedAt(new \DateTime('now'));
        }
    }
}
