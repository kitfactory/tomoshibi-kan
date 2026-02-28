#!/usr/bin/env node
const path = require("path");
const { spawn } = require("child_process");

function printHelp() {
  console.log("palpal - launch PalPal-Hive wireframe via Electron");
  console.log("");
  console.log("Usage:");
  console.log("  palpal");
  console.log("  palpal --devtools");
  console.log("  palpal --help");
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

let electronBinary;
try {
  // electron package exports the executable path.
  electronBinary = require("electron");
} catch (err) {
  console.error("electron dependency was not found. Run `npm install` first.");
  process.exit(1);
}

const appRoot = path.resolve(__dirname, "..");
const electronArgs = [appRoot];
if (args.includes("--devtools")) {
  electronArgs.unshift("--auto-open-devtools-for-tabs");
}

const child = spawn(electronBinary, electronArgs, {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code || 0);
});

