const fs = require("fs");
const path = require("path");

function checkNamingConvention(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  // Example naming conventions
  if (ext === ".js" || ext === ".ts") {
    if (baseName !== baseName.toLowerCase()) {
      return `File name "${fileName}" should be in lower case.`;
    }
  }

  // Add more checks based on your naming conventions

  return null;
}

function checkDirectory(directory) {
  const files = fs.readdirSync(directory);
  let errors = [];

  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      errors = errors.concat(checkDirectory(fullPath)); // Recurse into subdirectories
    } else {
      const error = checkNamingConvention(fullPath);
      if (error) errors.push(error);
    }
  });

  return errors;
}

// Example usage
const directory = "./src"; // Adjust as needed
const errors = checkDirectory(directory);

if (errors.length > 0) {
  console.error("Naming convention errors found:");
  errors.forEach((error) => console.error(error));
  process.exit(1); // Exit with error code if there are issues
} else {
  console.log("All naming conventions are correct.");
}
