FROM node:14.8.0-slim

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app/

CMD ["npm","start"]

EXPOSE 8080
