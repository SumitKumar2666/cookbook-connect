FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npx nest build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]