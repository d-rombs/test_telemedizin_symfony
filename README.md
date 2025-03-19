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
git clone https://github.com/username/telemedizin.git
cd telemedizin
```

2. Docker-Container starten:
```bash
docker-compose up -d
```

3. Backend-Abhängigkeiten installieren:
```bash
docker-compose exec php composer install
```

4. Datenbank einrichten:
```bash
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:migrations:migrate

docker-compose exec php bin/console doctrine:migrations:diff

docker-compose exec php bin/console doctrine:schema:update

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

## Tests ausführen

### Backend-Tests:
```bash
docker-compose exec php bin/phpunit
# oder mit Pest
docker-compose exec php vendor/bin/pest
```

### Frontend-Tests:
```bash
docker-compose exec frontend npm test
```

## Projektstruktur

- `backend/`: Symfony-Backend-Anwendung
- `frontend/`: React-Frontend-Anwendung
- `docker/`: Docker-Konfigurationsdateien

### Installation und Ausführung

1. Repository klonen
2. Docker und Docker Compose installieren
3. Projekt starten:

```bash
docker-compose up -d
```

### Zugriff auf die Anwendung

- Backend API: `http://localhost:8002/api`
- Frontend: `http://localhost:3002`

### Entwicklerwerkzeuge

#### MailHog E-Mail-Testen

Diese Anwendung verwendet MailHog für das Testen von E-Mails in der Entwicklungsumgebung. Alle von der Anwendung gesendeten E-Mails werden von MailHog abgefangen und können über die Weboberfläche angezeigt werden.

So verwenden Sie MailHog:

1. Starten Sie die Anwendung mit der Override-Konfiguration:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
   ```

2. Greifen Sie auf die MailHog-Weboberfläche zu:
   ```
   http://localhost:8027
   ```


#### Xdebug-Konfiguration

Für PHP-Debugging ist Xdebug vorkonfiguriert:

1. Konfigurieren Sie Ihren IDE (PHPStorm, VS Code, etc.) für Xdebug:
   - Server-Name: Docker
   - Host: localhost
   - Port: 9003
   - Path mapping: Lokaler Pfad `/path/to/project/backend` -> Container-Pfad `/var/www/html`

2. Starten Sie eine Debug-Session über Ihren Browser mit dem Xdebug-Browser-Plugin oder fügen Sie `?XDEBUG_SESSION=PHPSTORM` zu Ihren URLs hinzu.


### Symfony-Befehle ausführen

```bash
docker-compose exec php bin/console cache:clear
docker-compose exec php bin/console doctrine:migrations:migrate
```


