# Telemedizin Terminplanungssystem

Ein einfaches telemedizinisches Terminplanungssystem mit Symfony API-Platform als Backend und React/TypeScript im Frontend.

## Funktionen

- Ärzteübersicht mit Filterung nach Fachgebiet
- Verfügbare Zeitfenster für Telemedizin-Termine anzeigen
- Termine erstellen, anzeigen und stornieren
- E-Mail-Benachrichtigungen für Terminbestätigungen und -stornierungen
- Echtzeit-Verfügbarkeitsprüfung
- Suchfunktion für Ärzte nach Name oder Fachgebiet

## Technologien

### Backend
- PHP 8.2 mit Symfony 6.3
- API Platform für RESTful API
- Doctrine ORM für Datenbankoperationen
- PHPUnit und Pest für Tests
- Symfony Mailer für E-Mail-Benachrichtigungen

### Frontend
- React 18 mit TypeScript
- React Router für Navigation
- React Bootstrap für UI-Komponenten
- Axios für API-Anfragen
- React Hook Form für Formularverwaltung
- date-fns für Datumsformatierung

### Infrastruktur
- Docker und Docker Compose für die Containerisierung
- MySQL 8.0 als Datenbank
- Nginx als Webserver

## Installation

### Voraussetzungen
- Docker und Docker Compose

### Schritte zur Installation

1. Repository klonen:
```bash
git clone https://github.com/d-rombs/test_telemedizin_symfony.git
cd test_telemedizin_symfony
```

2. Docker-Container starten:
```bash
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

3. Backend-Abhängigkeiten installieren:
```bash
docker-compose exec php composer install
```

4. Datenbank einrichten:
```bash

docker-compose exec php bin/console doctrine:migrations:migrate

docker-compose exec php bin/console doctrine:fixtures:load --no-interaction
```

5. Frontend-Abhängigkeiten installieren:
```bash
docker-compose exec frontend npm install
```

## Zugriff auf die Anwendung

- Frontend: http://localhost:3002
- API: http://localhost:8002/api
- API-Dokumentation: http://localhost:8002/api/docs
- Mailhog: http://localhost:8027/

## Tests ausführen

### Backend-Tests:
```bash
docker-compose exec php bin/phpunit
# oder mit Pest
docker-compose exec php vendor/bin/pest
```

## Projektstruktur

- `backend/`: Symfony-Backend-Anwendung
- `frontend/`: React-Frontend-Anwendung
- `docker/`: Docker-Konfigurationsdateien


### Symfony-Befehle ausführen

```bash
docker-compose exec php bin/console cache:clear
docker-compose exec php bin/console doctrine:migrations:migrate
docker-compose exec php bin/console debug:router
```


