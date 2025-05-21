const { execSync } = require("child_process");
const fs = require("fs");

const sourceFile = "dependencies.json";
const flags = process.argv[2]; // e.g., -f, -h

if (fs.existsSync(sourceFile) === false) {
  console.error(`❌ Missing dependency source file: ${sourceFile}`);
  process.exit(1);
}

const dependencyList = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));

const shouldInstall = (key) =>
  flags === false ||
  (flags === "-f" && (key === "foundry" || key === "common")) ||
  (flags === "-h" && (key === "hardhat" || key === "common"));

const isValidDependency = (key) => {
  key === "foundry" || key === "hardhat" || key === "common";
};

for (const [key, items] of Object.entries(dependencyList)) {
  if (isValidDependency(key) === false) {
    console.error(`❌ Invalid dependency key: ${key}`);
    continue;
  }

  if (shouldInstall(key) === false) {
    console.log(`Skipping ${key} dependencies...`);
    continue;
  }

  if (Array.isArray(items) === false || items.length === 0) {
    console.log(`No ${key} dependencies found.`);
    continue;
  }

  console.log(`📦 Installing ${key} dependencies:\n`);

  for (const item of items) {
    try {
      if (key === "foundry") {
        console.log(`🔧 forge install ${item}`);
        execSync(`forge install --no-git ${item}`, {
          stdio: "inherit",
        });
      }

      if (key === "common" || key === "hardhat") {
        console.log(`🧶 npm install ${item}`);
        execSync(`npm install ${item}`, { stdio: "inherit" });
      }
    } catch (err) {
      console.error(`❌ Failed to install ${item} with error: ${err.message}`);
    }
  }

  console.log(`✅ Done installing ${key} dependencies\n`);
}
