FROM node:14-alpine

WORKDIR /app

RUN chown node:node /app

COPY --chown=node:node package*.json ./

RUN yarn install

COPY --chown=node:node . .

EXPOSE 5000

CMD ["yarn", "start"]