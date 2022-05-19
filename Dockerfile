FROM alpine:latest
RUN apk add --update \
nodejs \
npm && rm -rf /var/cache/apk/*
COPY package.json /package.json
RUN npm i --silent --prod
#COPY .env /.env
COPY app.js /app.js
COPY bin/ /bin
COPY lib/ /lib
COPY server/ /server
COPY sql/ /sql
EXPOSE 3002
CMD ["npm","start"]