FROM node:0.10.33

RUN curl -o /usr/local/bin/compose2bash -L https://github.com/dockito/compose2bash/releases/download/v1.1.0/compose2bash-linux_amd64 \
    && chmod +x /usr/local/bin/compose2bash

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 80

CMD [ "npm", "start" ]
