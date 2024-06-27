FROM node:16

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

WORKDIR /usr/app/backend

RUN npm ci

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate
RUN npm run build

# Export port 3000 to outside services
EXPOSE 3000

CMD ["npm", "start"]