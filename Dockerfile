FROM node:18 as build-deps
WORKDIR /usr/src/app

ARG DOCKER_ENV=production

COPY package.json yarn.lock ./

RUN yarn
COPY . ./
RUN  if [ "$DOCKER_ENV" = "staging" ] ; then  yarn staging;  else  yarn build; fi

# Stage 2 - the production environment
FROM nginx:stable-alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY nginx.vh.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]