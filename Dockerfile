FROM node:0.10.33

RUN apt-get -y -q update
RUN apt-get install ruby ruby-dev -y -q
RUN apt-get install golang -y -q
RUN apt-get install git -y -q

RUN git clone https://github.com/coreos/fleet.git /usr/lib/fleet
RUN cd /usr/lib/fleet && ./build
RUN ln -s /usr/lib/fleet/bin/fleetctl /usr/local/bin/fleetctl

RUN git clone https://github.com/dockito/fig2coreos.git /tmp/fig2coreos && \
        cd /tmp/fig2coreos && \
        gem build fig2coreos.gemspec && \
        gem install fig2coreos-0.1.6.gem && \
        cd / && \
        rm -rf /tmp/fig2coreos

ENV FLEETCTL_ENDPOINT http://172.17.42.1:4001

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

RUN chmod +x /usr/src/app/bin/provision.sh

EXPOSE 80

CMD [ "npm", "start" ]
