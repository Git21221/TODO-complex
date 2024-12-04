FROM node:latest

COPY . /todo/app

WORKDIR /todo/app/

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]