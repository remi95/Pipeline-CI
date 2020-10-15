# Concerto

## Set up

First of all, we are now going to init the docker
* Clone the docker repo and go inside the folder :
```
git clone https://gitlab.com/concerto-19/docker.git concerto
cd concerto
```
Before anything, make sure to have docker and docker compose installed ([docker for windows](https://docs.docker.com/docker-for-windows/install/), [docker compose for windows](https://docs.docker.com/compose/install/)), to not have any mysql running on port 3306 nor apache on port 80

* Now clone the back and the front projects :
```
git clone https://gitlab.com/concerto-19/back.git back
git clone https://gitlab.com/concerto-19/front.git front
```
* We are going to set up the symfony environment. We will create env vars, create private and public keys for jwt to work and adds the jwt credentials (make sure to remember the passphrase you enters when typping openssl commands as you will have to replace in one of the following commands [yourPassphrase] with your passphrase) :
```
cd back
mkdir config/jwt
openssl genrsa -out config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem

echo 'JWT_PASSPHRASE=[yourPassphrase]' >> .env.local
echo 'DATABASE_URL="mysql://concerto:nkDZnodzna877u@127.0.0.1:3306/concerto"' >> .env.local
```
* Now, go to the front folder to add env vars. Once the parameters.dist.ts file is copyied, fill the two vars in parameters.ts with the correct values :
```
cd ../front
cp src/parameters.dist.ts src/parameters.ts
cd ../
```

## Install
We can now install our docker images
* Run the following command to create the react and the apache/php docker images. It is a seperated command because the Dockerfile isn't located in the exact same place as the front project. Be sure to execute into the *concerto* global folder :
```
docker build -t concerto_front . -f react/Dockerfile
docker build -t concerto_back . -f apache-php/Dockerfile
```
* Now we can let docker compose to build the rest :
```
docker-compose up
```
* Once everything has started, you need to go into the back container, install the vendors and set up the database :
```
docker exec -it concerto_back /bin/sh
composer install
php bin/console d:d:d --force
php bin/console d:d:c
php bin/console d:s:u --force
```

Everything should now works fine ! Enjoy.