<?php

namespace App\Entity;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

class RequestListener {

    /**
     * @var User
     */
    private $loggedUser;

    /**
     * RequestListener constructor.
     *
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->loggedUser = $security->getUser();
    }

    public function prePersist(Request $request, LifecycleEventArgs $event) {
        if (is_null($request->getUser())) {
            if (!is_null($this->loggedUser)) {
                $request->setUser($this->loggedUser);
            }
        }
    }
}