FROM nginx:1.19.1-alpine

COPY dist /usr/share/nginx/html
COPY internal/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]