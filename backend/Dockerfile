FROM node:16

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

WORKDIR /usr/app/backend

RUN npm ci

# Export port 3000 to outside services
EXPOSE 3000

CMD ["npm", "start"]