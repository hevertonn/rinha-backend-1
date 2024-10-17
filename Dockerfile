FROM oven/bun:1 as base

WORKDIR /usr/src/app

COPY package.json .

RUN bun install

COPY . .

ENTRYPOINT ["bun", "start"]
