FROM node:16 AS deps
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV NODE_ENV=production
RUN  pnpm i

FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:16 AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.mjs ./server.mjs

USER nextjs
EXPOSE 9601
ENV PORT 9601

CMD ["npm", "start"]
