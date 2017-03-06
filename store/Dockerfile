FROM node:7.6

ENV APP_HOME /var/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME/package.json
COPY yarn.lock $APP_HOME/yarn.lock
RUN yarn

COPY . $APP_HOME

