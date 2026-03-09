const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

function normalizeString(value) {
  return String(value || "").trim();
}

function getOptionValue(args, name, fallback = "") {
  const index = args.indexOf(name);
  if (index < 0 || index + 1 >= args.length) return fallback;
  return normalizeString(args[index + 1]) || fallback;
}

function createWorkspaceRoot(args) {
  const explicit = normalizeString(getOptionValue(args, "--workspace"));
  if (explicit) {
    fs.mkdirSync(explicit, { recursive: true });
    return path.resolve(explicit);
  }
  return fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibi-kan-multistep-observe-"));
}

function main() {
  const args = process.argv.slice(2);
  const workspaceRoot = createWorkspaceRoot(args);
  const runnerPath = path.resolve(__dirname, "run_orchestrator_three_task_cycle_check.js");
  const nodePath = process.execPath;
  const commandArgs = [
    runnerPath,
    "--workspace",
    workspaceRoot,
    "--turn-timeout-ms",
    "240000",
    "--prompt",
    "設定画面の保存まわりに困っています。少しずつ整理したいです。",
    "--prompt",
    "reload 後に model が消えるので、まず何から見ればよいでしょうか。",
    "--prompt",
    "再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ることです。まず原因を調べて、その後で直し、最後に利用者向けの案内文まで整えたいです。",
    "--prompt",
    "ではその内容で依頼にしてください。冬坂 / 久瀬 / 白峰 の3人に分けて進めたいです。",
  ];

  const output = execFileSync(nodePath, commandArgs, {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  process.stdout.write(output);
}

main();
