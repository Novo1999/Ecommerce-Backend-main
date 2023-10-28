FROM node:18.18.0

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=8080
ENV MONGO_URL=mongodb+srv://Novodip:GJnvUduniUIBHKT3@nodeexpressprojects.a2kitrl.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=AtlasApp
ENV JWT_SECRET=1d6bfd893dc3a34241cf99dcbcba13fb015ea
ENV JWT_TIMEOUT=1d

COPY . .

RUN npm i


RUN npm start

EXPOSE 8080
