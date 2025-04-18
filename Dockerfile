# BASE IMAGES

FROM public.ecr.aws/docker/library/node:22.12.0-bookworm AS base 

# BUILDER IMAGES

FROM base AS build
WORKDIR /build
COPY --chown=node:node package*.json .
RUN npm install
COPY --chown=node:node . .
RUN npm run build && npm install --omit-dev

# PROJECT IMAGES

FROM base AS project
WORKDIR /project
COPY --chown=node:node package.json .
COPY --chown=node:node --from=build /build/dist ./dist
COPY --chown=node:node --from=build /build/node_modules ./node_modules
ENTRYPOINT ["npm", "run", "start:prod"]
