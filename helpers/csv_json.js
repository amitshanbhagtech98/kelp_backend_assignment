const csv = require("csv-parser");
const fs = require('fs');
const filePath = process.env.CSV_FILE_PATH;

const csv2json = async () => {
    return new Promise((resolve, reject) => {
        const results = [];

        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File not found: ${filePath}`));
        }

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(nestProperties(data)))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
}

function nestProperties(flatObject) {
    const nestedObject = {};
    for (const key in flatObject) {
        const value = flatObject[key];
        const keys = key.split("."); // Split nested keys (e.g., "name.firstName")
        let currentLevel = nestedObject;
        for (let i = 0; i < keys.length; i++) {
            const subKey = keys[i];
            if (i === keys.length - 1) {
                currentLevel[subKey] = value; // Assign value to the last key
            } else {
                currentLevel[subKey] = currentLevel[subKey] || {}; // Ensure the next level exists
                currentLevel = currentLevel[subKey]; // Move deeper
            }
        }
    }
    return nestedObject;
}

module.exports = { csv2json }
