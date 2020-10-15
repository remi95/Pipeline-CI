<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\HasLifecycleCallbacks
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"registration", "login"})
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $firstname;

    /**
     * @ORM\Column(type="datetime")
     */
    private $birthdate;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $phone;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Badge")
     */
    private $badges;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Request", mappedBy="user")
     */
    private $requests;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserFavor", mappedBy="user", cascade={"persist", "remove"})
     */
    private $favors;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Picture", cascade={"persist", "remove"})
     */
    private $picture;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="user", orphanRemoval=true)
     */
    private $comments;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $apiToken;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isAdmin;

    public function __construct($object = null)
    {
        if (is_null($object)) {
            $this->badges = new ArrayCollection();
            $this->requests = new ArrayCollection();
            $this->comments = new ArrayCollection();
            $this->favors = new ArrayCollection();
        } else {
            // Initializing class properties
            foreach ($object as $property => $value) {
                $this->$property = $value;
            }
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string)$this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(\DateTimeInterface $birthdate): self
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getIsAdmin(): ?bool
    {
        return $this->isAdmin;
    }

    public function setIsAdmin(bool $isAdmin): self
    {
        if ($isAdmin) {
            $roles = $this->roles;
            // guarantee every user at least has ROLE_USER
            $roles[] = 'ROLE_ADMIN';
            $this->setRoles(array_unique($roles));
        } else {
            $roles = $this->roles;
            if (($key = array_search('ROLE_ADMIN', $roles)) !== false) {
                unset($roles[$key]);
            }
            // Re-index array elements
            $newRoles = array_values($roles);
            $this->setRoles(array_unique($newRoles));
        }
        $this->isAdmin = $isAdmin;

        return $this;
    }

    /**
     * @return Collection|Badge[]
     */
    public function getBadges(): Collection
    {
        return $this->badges;
    }

    public function addBadge(Badge $badge): self
    {
        if (!$this->badges->contains($badge)) {
            $this->badges[] = $badge;
        }

        return $this;
    }

    public function removeBadge(Badge $badge): self
    {
        if ($this->badges->contains($badge)) {
            $this->badges->removeElement($badge);
        }

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
            $request->setUser($this);
        }

        return $this;
    }

    public function removeRequest(Request $request): self
    {
        if ($this->requests->contains($request)) {
            $this->requests->removeElement($request);
            // set the owning side to null (unless already changed)
            if ($request->getUser() === $this) {
                $request->setUser(null);
            }
        }

        return $this;
    }

    public function getPicture(): ?Picture
    {
        return $this->picture;
    }

    public function setPicture(?Picture $picture): self
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|UserFavor[]
     */
    public function getFavors(): Collection
    {
        return $this->favors;
    }

    public function addFavor(UserFavor $favor): self
    {
        if (!$this->favors->contains($favor)) {
            $this->favors[] = $favor;
        }

        return $this;
    }

    public function removeFavor(UserFavor $favor): self
    {
        if ($this->favors->contains($favor)) {
            $this->favors->removeElement($favor);
        }

        return $this;
    }

    public function getApiToken(): ?string
    {
        return $this->apiToken;
    }

    public function setApiToken(?string $apiToken): self
    {
        $this->apiToken = $apiToken;

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

    public function __toString()
    {
        return $this->getFirstname()." ".$this->getLastname();
    }
}
