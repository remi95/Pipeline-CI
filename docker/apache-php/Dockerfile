FROM php:7.4-apache

ENV COMPOSER_ALLOW_SUPERUSER=1

EXPOSE 80
WORKDIR /app

COPY ./api .

RUN apt-get update -qq && \
    apt-get install -qy \
    git \
    gnupg \
    libicu-dev \
    libzip-dev \
    unzip \
    zip \
    zlib1g-dev && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN composer install

# PHP Extensions
RUN docker-php-ext-configure zip && \
    docker-php-ext-install -j$(nproc) intl opcache pdo_mysql zip
COPY docker/apache-php/conf/php.ini /usr/local/etc/php/conf.d/app.ini

# Apache
COPY docker/apache-php/conf/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/apache-php/conf/apache.conf /etc/apache2/conf-available/concerto.conf

RUN a2enmod rewrite remoteip && \
    a2enconf concerto
