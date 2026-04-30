import "dotenv/config";

import { spawnSync } from "node:child_process";

function resolveDockerDatabaseUrl(value) {
  if (!value) {
    throw new Error("DATABASE_URL_LOCAL is not set.");
  }

  const url = new URL(value);

  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    url.hostname = "host.docker.internal";
  }

  return url;
}

function run(command, args, env) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const databaseUrl = resolveDockerDatabaseUrl(process.env.DATABASE_URL_LOCAL);
const env = {
  ...process.env,
  DATABASE_URL_LOCAL: databaseUrl.toString(),
};

if (process.argv.includes("--print-db-target")) {
  console.log(
    JSON.stringify(
      {
        hostname: databaseUrl.hostname,
        database: databaseUrl.pathname.replace(/^\//, ""),
      },
      null,
      2
    )
  );
  process.exit(0);
}

console.log(
  `Using PostgreSQL at ${databaseUrl.hostname} for database "${databaseUrl.pathname.replace(
    /^\//,
    ""
  )}".`
);

run("npm", ["ci"], env);
run("npx", ["prisma", "generate"], env);
run("npx", ["prisma", "migrate", "deploy"], env);
run("npm", ["run", "db:seed"], env);
run("npm", ["run", "dev:docker"], env);
