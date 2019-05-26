FROM node:10.3.0-alpine
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
EXPOSE 7777
ENV NODE_ENV=development
RUN npm run build
RUN npm run start

