import fs from "fs";

//read json file
export function readJsonFile(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        reject(err); // Reject the promise if there is an error
        return;
      }

      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        // console.log(jsonData);
        resolve(jsonData); // Resolve the promise with the parsed JSON data
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject(error); // Reject the promise if there is an error in parsing
      }
    });
  });
}

//write json file
export function writeJsonFile(filePath: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        reject(err); // Reject the promise if there is an error
        return;
      }

      resolve(); // Resolve the promise if successful
    });
  });
}

export function appendToJsonFile(filePath: string, newData: object) {
  try {
    // Read the existing file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileContent);

    // Append new data
    jsonData.push(newData);

    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
    console.log("Data successfully appended to the JSON file");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}
