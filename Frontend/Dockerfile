# Etapa 1: build
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: ejecución
FROM node:18

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV production

EXPOSE 3001
CMD ["npm", "start"]
