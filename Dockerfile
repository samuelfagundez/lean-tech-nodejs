FROM node:14.8.0-slim

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install --production --no-optional

COPY . /app/

CMD ["npm","start"]

EXPOSE 8080
