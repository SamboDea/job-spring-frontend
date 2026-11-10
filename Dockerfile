FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV BETTER_AUTH_SECRET=build-time-placeholder-secret
ENV BETTER_AUTH_URL=http://localhost:3000

ARG NEXT_PUBLIC_SPRING_API_URL
ENV NEXT_PUBLIC_SPRING_API_URL=$NEXT_PUBLIC_SPRING_API_URL

ARG SPRING_API_URL
ENV SPRING_API_URL=$SPRING_API_URL

RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]