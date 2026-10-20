import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.AUTH_SECRET ??= "local-development-secret-change-this-32chars";
const productionSchemaPath = path.join(root, "prisma", "schema.prisma");
const localSchemaPath = path.join(root, "prisma", "schema.local.prisma");

const productionSchema = readFileSync(productionSchemaPath, "utf8");
const localSchema = productionSchema
  .replace('provider  = "postgresql"', 'provider  = "sqlite"')
  .replace(
    /  url\s+= env\("POSTGRES_PRISMA_URL"\)\r?\n  directUrl\s+= env\("POSTGRES_URL_NON_POOLING"\)/,
    '  url       = "file:./dev.db"'
  );

writeFileSync(localSchemaPath, localSchema);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("npx", ["prisma", "generate", "--schema", "prisma/schema.local.prisma"]);
run("npx", ["prisma", "db", "push", "--schema", "prisma/schema.local.prisma", "--accept-data-loss"]);

if (!existsSync(path.join(root, "prisma", "dev.db"))) {
  run("npm", ["run", "db:seed"]);
} else {
  const seed = spawnSync("npm", ["run", "db:seed"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (seed.status !== 0) process.exit(seed.status ?? 1);
}

const next = spawn("npx", ["next", "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

const stop = () => {
  if (!next.killed) next.kill();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => process.exit(code ?? 0));
