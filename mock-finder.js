const fs = require("fs");
const path = require("path");

const keywords = [
  "mock",
  "dummy",
  "faker",
  "chance",
  "setTimeout",
  "Promise\\(resolve",
  "localhost",
  "const .* = \\[\\{", // hardcoded array
];


function searchDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf8");
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, "gi");
        if (regex.test(content)) {
          console.log(`🚩 Mock tespit edildi: ${fullPath}`);
          console.log(`   Anahtar Kelime: ${keyword}`);
          console.log("—".repeat(50));
        }
      });
    }
  });
}

// Projenin src klasöründe çalıştır:
searchDir("./frontend/project/src");
