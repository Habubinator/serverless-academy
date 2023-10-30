const fs = require('fs');

function extractUsernamesFromFile(filename) {

    const text = fs.readFileSync(filename, 'utf8');
    const words = text.split('\n');
    const usernameSet = new Set(words);

    return usernameSet;

}

function uniqueValues(fileNames) {

    let allUniqueUsernames = new Set();

    for (const fileName of fileNames) {

        const usernames = extractUsernamesFromFile(fileName);
        allUniqueUsernames = new Set([...allUniqueUsernames, ...usernames]);

    }

    return allUniqueUsernames.size;

}

function existInAllFiles(fileNames) {

    let commonUsernames = new Set();

    const firstFileUsernames = extractUsernamesFromFile(fileNames[0]);
    commonUsernames = new Set([...commonUsernames, ...firstFileUsernames]);

    for (let i = 1; i < fileNames.length; i++) {

        const usernames = extractUsernamesFromFile(fileNames[i]);
        const newCommonUsernames = new Set();
        
        for (const username of commonUsernames) {

            if (usernames.has(username)) {

                newCommonUsernames.add(username);

            }

        }
        
        commonUsernames = newCommonUsernames;

    }

    return commonUsernames.size;

}

function existInAtleastTen(fileNames) {

    const usernameCounts = {};

    for (const fileName of fileNames) {

        const usernames = extractUsernamesFromFile(fileName);

        for (const username of usernames) {

            usernameCounts[username] = (usernameCounts[username] || 0) + 1;

        }

    }

    const usernamesIn10OrMoreFiles = Object.keys(usernameCounts).filter(username => usernameCounts[username] >= 10);
    return new Set(usernamesIn10OrMoreFiles).size;

}

const startTime = Date.now();

const fileNames = Array.from({ length: 20 }, (_, i) => `./textFiles/out${i}.txt`);

// Task 1: Determine how many unique usernames there are in all the files
console.log(`Total unique usernames in all files: ${uniqueValues(fileNames)}`);

// Task 2: Determine how many usernames occur in all 20 files
console.log(`Usernames occurring in all 20 files: ${existInAllFiles(fileNames)}`);

// Task 3: Find out how many usernames occur in at least 10 files
console.log(`Usernames occurring in at least 10 files: ${existInAtleastTen(fileNames)}`);

console.log("That tasks needed " + (Date.now() - startTime) + "ms to complete\n")
