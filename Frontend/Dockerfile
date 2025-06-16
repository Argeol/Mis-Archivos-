# Etapa de construcción
FROM node:18 AS build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Etapa de producción con NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada de NGINX si la tienes (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
