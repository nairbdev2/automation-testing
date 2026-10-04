FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production \
    DATA_DIR=/app/data

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY public ./public
COPY foreign ./foreign

RUN mkdir -p /app/data && chown node:node /app/data
USER node

VOLUME ["/app/data"]
EXPOSE 3000 3001
CMD ["node", "server/index.js"]
