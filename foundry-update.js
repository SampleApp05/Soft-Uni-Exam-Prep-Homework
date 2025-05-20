const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const depsFile = "foundry-dependencies.json";

if (fs.existsSync(depsFile) == false) {
  console.error(`❌ Missing ${depsFile}`);
  process.exit(1);
}

const deps = JSON.parse(fs.readFileSync(depsFile, "utf-8"));

if (Array.isArray(deps) == false || deps.length === 0) {
  console.log("No dependencies found in foundry-deps.json");
  process.exit(0);
}

console.log(`📦 Installing ${deps.length} Foundry dependencies...\n`);

for (const raw of deps) {
  try {
    const [url, query] = raw.split("?");
    const tag = query?.split("tag=")[1];
    const name = path.basename(url).replace(/\.git$/, "");

    console.log(`➡️  Installing ${name}${tag ? ` (tag: ${tag})` : ""}`);

    const tagArg = tag ? `--tag ${tag}` : "";
    execSync(`forge install --no-git ${url} ${tagArg}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Failed to install: ${raw}`);
  }
}

console.log("\n✅ All dependencies processed.");
