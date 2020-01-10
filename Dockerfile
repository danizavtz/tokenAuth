FROM alpine:latest
RUN apk add --update \
nodejs \
nodejs-npm \
git \
python \
build-base \
gcc \
g++ \
python \
make && rm -rf /var/cache/apk/*
WORKDIR /app/
COPY package.json /app/package.json
RUN npm i --silent
COPY app.js /app/app.js
COPY bin/ /app/bin
COPY lib/ /app/lib
COPY server/ /app/server
COPY sql/ /app/sql
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 3002
CMD ["npm start"]