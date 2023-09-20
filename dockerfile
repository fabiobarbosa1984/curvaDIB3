# base image
FROM node:14

# aplication directory
WORKDIR /usr/src/app

# primary files needed (package.json and package-lock.json)
COPY package*.json ./

# dependency install
RUN npm install

# test process
COPY test/* ./test/


# Copy the application code into the container
COPY app/* ./app/

# Run the tests
RUN npm test

# starting the app
CMD ["node", "app/app.js"]

#exposing the used port
EXPOSE 3000