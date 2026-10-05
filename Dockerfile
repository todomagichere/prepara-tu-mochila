FROM node:22-alpine AS validate

WORKDIR /app
COPY index.html ./
COPY assets ./assets

# La validación se ejecuta dentro del build: no requiere Node en el host.
RUN node --check assets/app.js

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
COPY --from=validate /app /usr/share/nginx/html

EXPOSE 80
