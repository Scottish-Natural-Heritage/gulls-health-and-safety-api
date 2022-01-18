################################################################################
# Builder Stage
################################################################################

# We're deploying to the 16-alpine image, so do our building on it too.
FROM node:16-alpine as builder

# By default, we want to do everything in a non-privileged user, so go to their
# home dir and drop to their account.
WORKDIR /home/node
USER node

# We need to transpile a lot of our code, so copy this to the builder image.
COPY --chown=node:node ./src ./src

# Install all the build, test & run dependencies.
COPY --chown=node:node package*.json ./
RUN npm ci

# Build the `.js` and `.css` from our `.ts` and `.scss` files.
COPY --chown=node:node tsconfig.json ./
RUN npm run build

# Remove all the build & test dependencies but leave the run dependencies.
RUN npm prune --production

################################################################################
# Deployable Image
################################################################################

# We built on the 16-alpine image, so we need to deploy on it too.
FROM node:16-alpine

# Drop back to the non-privileged user for run-time.
WORKDIR /home/node
USER node

# Tell node, et al to run in production mode.
ENV NODE_ENV production

# Copy the run dependencies, built code and scripts from the builder.
COPY --chown=node:node --from=builder /home/node/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/dist ./dist
COPY --chown=node:node --from=builder /home/node/package.json ./

# Copy the code from the project.
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./util ./util
COPY --chown=node:node .sequelizerc ./

# These variables are for overriding but keep them consistent between image and
# run.
ENV GULLS_API_PORT 3017
ENV GULLS_API_PATH_PREFIX gulls-health-and-safety-api

# These variables are for overriding and they only matter during run.
ENV LICENSING_DB_HOST override_this_value
ENV LICENSING_DB_PASS override_this_value
ENV GULLS_DB_PASS override_this_value
ENV RO_GULLS_DB_PASS override_this_value
ENV PC_LOOKUP_API_KEY override_this_value
ENV GULLS_NOTIFY_API_KEY override_this_value

# Let docker know about our listening port.
EXPOSE $GULLS_API_PORT

# Run the default start script, which kicks off a few pre-start things too.
CMD ["npm", "start"]
