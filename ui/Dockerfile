# Build step #1: build the React front end
FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./ui/package.json ./
COPY ./ui/src ./src
RUN npm install
