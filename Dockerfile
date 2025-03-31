FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Sử dụng file .env.docker cho build production
RUN cp .env.docker .env.production

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Define environment variables cho container
ENV VIRTUAL_HOST=dsc.fit.hcmute.edu.vn
ENV LETSENCRYPT_HOST=dsc.fit.hcmute.edu.vn
ENV LETSENCRYPT_EMAIL=your-email@example.com

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]