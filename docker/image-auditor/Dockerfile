FROM node:12.16.3

WORKDIR /opt/app

COPY src ./

# install dependencies (node_modules dir)
RUN npm i

ENTRYPOINT [ "node", "app.js" ]