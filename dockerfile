FROM nginx:alpine

COPY dist/build.txt /usr/share/nginx/html/build.txt