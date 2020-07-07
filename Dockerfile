FROM bigwisu/pm2

ADD package*.json /tmp/
RUN cd /tmp && npm install
RUN npm install pm2 -g
RUN mkdir -p /usr/src/app/logs && cp -a /tmp/node_modules /usr/src/app/ && chmod 777 /usr/src/app/logs
WORKDIR /usr/src/app
ADD . /usr/src/app

EXPOSE 3000

CMD [ "pm2-runtime", "process.yaml"]