FROM node:16
#Create app directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .
RUN npm run build

# 3 migrations
#RUN npm run migrate up
#RUN npm run migrate up
#RUN npm run migrate up

EXPOSE 4000
CMD [ "node", "build/index.js" ]