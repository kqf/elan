# Build step #1: build the React front end
FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./ui .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
