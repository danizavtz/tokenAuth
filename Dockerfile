FROM alpine:latest
RUN apk add --update \
nodejs \
nodejs-npm && rm -rf /var/cache/apk/*
COPY package.json /package.json
RUN npm i --silent --prod
#COPY .env /.env #if build local
COPY app.js /app.js
COPY bin/ /bin
COPY lib/ /lib
COPY server/ /server
COPY sql/ /sql
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3002
CMD ["npm","start"]