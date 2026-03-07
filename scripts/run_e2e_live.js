const { spawnSync } = require("child_process");

const command = process.execPath;
const args = [
  require.resolve("@playwright/test/cli"),
  "test",
  "tests/e2e/clawhub-live.spec.js",
];
const env = {
  ...process.env,
  PALPAL_E2E_LIVE: "1",
};

const result = spawnSync(command, args, {
  env,
  stdio: "inherit",
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

if (result.error) {
  // English-only: command wrapper diagnostics for CI logs.
  console.error(`[palpal] failed to execute ${command}:`, result.error.message);
}
process.exit(1);
