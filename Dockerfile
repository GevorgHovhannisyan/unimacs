FROM node:12.22.4-alpine as build
ADD . /cms
WORKDIR /cms
COPY package*.json ./
RUN npm install
COPY . .
# RUN apt update && \
#     apt install -qq make \
#                     python \
#                     gcc \
#                     g++
# RUN npm config set unsafe-perm true && \
#     npm install npm -g && \
#     npm install node-gyp \
#                 node-sass -g && \
#                 ls -la &&
#     npm install && \
#     npm run build
RUN npm rebuild node-sass
RUN npm run build

FROM nginx:latest
COPY --from=build /cms/configs/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /cms/dist /usr/share/nginx/html
