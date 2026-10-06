FROM node:22-alpine AS validate

WORKDIR /app
COPY index.html lista-mochila-emergencia-72-horas.html plan-familiar-emergencia-72-horas.html ./
COPY robots.txt sitemap.xml llms.txt ./
COPY assets ./assets

# La validación se ejecuta dentro del build: no requiere Node en el host.
RUN node --check assets/app.js && node --check assets/consent.js

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
COPY --from=validate /app /usr/share/nginx/html

EXPOSE 80
