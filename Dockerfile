FROM node:alpine
RUN npm i -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN  pnpm i --frozen-lockfile --prod

COPY ./ ./

# Build app
RUN pnpm run build

# Expose the listening port
EXPOSE 9601

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script when container starts
CMD [ "npm", "start" ]