#Stage 1 - React Frontend Environment Setup
FROM node:12.12.0-alpine as build-deps
WORKDIR /usr/src/app
COPY . ./
COPY ./react-frontend/package.json ./react-frontend/package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build --production

#Stage 1 - Flask Backend Environment Setup
FROM python:3.7.3-stretch
WORKDIR /app
ADD ./flask-backend /app
RUN pip install -r requirements.txt
CMD ["uwsgi","app.ini"]

# Stage 2 - the production environment
FROM nginx:1.17.6-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

