import fs from 'fs';

export class JsonReader {

    async readJsonFile(filePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    reject(err); // Reject the promise if there is an error
                    return;
                }
            
                try {
                    // Parse the JSON data
                    const jsonData = JSON.parse(data);
                    // console.log(jsonData);
                    resolve(jsonData); // Resolve the promise with the parsed JSON data
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    reject(error); // Reject the promise if there is an error in parsing
                }
            });
        });
    }

}