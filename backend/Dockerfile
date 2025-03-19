FROM php:8.2-fpm as base-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_mysql \
    zip \
    intl \
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set recommended PHP.ini settings
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Erhöhen von Speicher- und Zeitlimits für Entwicklung
RUN echo "memory_limit=-1" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini

# Install Symfony CLI
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash && \
    apt-get install -y symfony-cli

EXPOSE 9000

CMD ["php-fpm"] 

FROM base-fpm as xdebug-fpm

RUN apt-get update && apt-get install -y \
    opcache \
    gd

# MailDev unterstützende Pakete installieren
RUN apt-get install -y \
    msmtp \
    mailutils

# Xdebug installieren
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Xdebug Konfiguration
RUN echo "xdebug.mode=develop,debug,coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.log=/var/log/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
    
# Erstellen des Log-Verzeichnisses für Xdebug
RUN mkdir -p /var/log && \
    touch /var/log/xdebug.log && \
    chmod 777 /var/log/xdebug.log

EXPOSE 9003

CMD ["php-fpm"] 