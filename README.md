# Listo 72H

Portal estático en español para orientar la preparación cotidiana de un hogar y una mochila de salida de 72 horas. Está pensado para publicarse con enlaces de Amazon Afiliados y se ejecuta íntegramente en Docker: no necesitas instalar Node, npm ni Nginx en el equipo anfitrión.

## Requisitos

- [Docker Engine](https://docs.docker.com/engine/install/) 24 o superior.
- Docker Compose v2 (`docker compose version`).
- Un navegador para abrir el portal localmente.

Comprueba que Docker está disponible:

```bash
docker --version
docker compose version
```

## Instalación y arranque local

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone git@github.com:todomagichere/prepara-tu-mochila.git
cd prepara-tu-mochila
```

Construye la imagen y arranca el portal en segundo plano:

```bash
docker compose up --build -d
```

Cuando termine, abre [http://localhost:8072](http://localhost:8072).

Comprueba el estado del contenedor con:

```bash
docker compose ps
```

Para ver sus registros:

```bash
docker compose logs -f portal
```

Para detenerlo y eliminar el contenedor:

```bash
docker compose down
```

## Desarrollo sin reconstruir

Durante el desarrollo, Compose monta `index.html`, `assets/` y `nginx.dev.conf` directamente en el contenedor y desactiva la caché del navegador. Tras el primer arranque, edita los archivos y recarga la página: no hace falta reconstruir la imagen para cambios de HTML, CSS o JavaScript.

Reconstruye solo si cambias el `Dockerfile`, una dependencia de la imagen base o `nginx.conf` (la configuración de producción):

```bash
docker compose up --build -d
```

Si el puerto `8072` está ocupado, cambia el primer número de esta línea en `docker-compose.yml` y vuelve a crear el servicio:

```yaml
ports:
  - "8072:80"
```

Por ejemplo, para usar el puerto 8090:

```yaml
ports:
  - "8090:80"
```

Después ejecuta:

```bash
docker compose up -d --force-recreate
```

Y abre `http://localhost:8090`.

## Afiliación de Amazon

El identificador de seguimiento se configura en `assets/app.js`, dentro de `PORTAL_CONFIG`:

```js
const PORTAL_CONFIG = {
  amazonAffiliateTag: "tu-tag-21"
};
```

Los enlaces de productos generan búsquedas en Amazon.es con ese identificador. Antes de publicar, reemplaza el valor de ejemplo por tu identificador real y comprueba los enlaces.

El pie incluye la divulgación requerida por Amazon Afiliados. Antes de poner el sitio en producción, sustituye los enlaces de privacidad y contacto por páginas reales y revisa la política de cookies y el [Acuerdo Operativo de Amazon Afiliados](https://afiliados.amazon.es/help/operating/agreement?ac-ms-src=ac-nav).

## Construcción de producción

El `Dockerfile` usa una construcción en dos fases:

1. Node 22, solo dentro de Docker, valida `assets/app.js`.
2. Nginx Alpine sirve los archivos estáticos en el puerto interno `80`.

Para generar únicamente la imagen de producción:

```bash
docker build -t prepara-tu-mochila:latest .
```

Para ejecutarla sin Compose:

```bash
docker run --rm -p 8072:80 prepara-tu-mochila:latest
```
