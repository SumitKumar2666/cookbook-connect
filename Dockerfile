FROM node:18-slim

# Install required system libs (openssl 1.1 + ca-certificates)
RUN apt-get update -y \
    && apt-get install -y curl ca-certificates gnupg wget \
    && wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl1.1/libssl1.1_1.1.1f-1ubuntu2.22_amd64.deb \
    && dpkg -i libssl1.1_1.1.1f-1ubuntu2.22_amd64.deb \
    && rm libssl1.1_1.1.1f-1ubuntu2.22_amd64.deb \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npx nest build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]