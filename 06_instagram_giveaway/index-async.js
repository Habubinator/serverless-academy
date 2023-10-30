const fs = require('fs').promises;

async function extractUsernamesFromFile(filename) {

    try {

        const text = await fs.readFile(filename, 'utf8');
        const words = text.split('\n');
        const usernameSet = new Set(words);

        return usernameSet;

    } catch (err) {
        console.error(`Error reading file ${filename}: ${err.message}`);
        return new Set();
    }
}

async function uniqueValues(fileNames) {

    const allUniqueUsernames = new Set();

    for (const fileName of fileNames) {

        const usernames = await extractUsernamesFromFile(fileName);
        usernames.forEach(username => allUniqueUsernames.add(username));

    }

    return allUniqueUsernames.size;

}

async function existInAllFiles(fileNames) {

    const commonUsernames = new Set();

    for (const fileName of fileNames) {

        const usernames = await extractUsernamesFromFile(fileName);

        if (commonUsernames.size === 0) {

            usernames.forEach(username => commonUsernames.add(username));

        } else {

            commonUsernames.forEach(username => {

                if (!usernames.has(username)) {

                    commonUsernames.delete(username);

                }

            });

        }

    }

    return commonUsernames.size;

}

async function existInAtleastTen(fileNames) {

    const usernameCounts = {};

    for (const fileName of fileNames) {

        const usernames = await extractUsernamesFromFile(fileName);
        usernames.forEach(username => {
            usernameCounts[username] = (usernameCounts[username] || 0) + 1;
        });

    }

    const usernamesIn10OrMoreFiles = Object.keys(usernameCounts).filter(username => usernameCounts[username] >= 10);
    return usernamesIn10OrMoreFiles.length;
    
}

const startTime = Date.now();

const fileNames = Array.from({ length: 20 }, (_, i) => `./textFiles/out${i}.txt`);

(async () => {
    // Task 1: Determine how many unique usernames there are in all the files
    console.log(`Total unique usernames in all files: ${await uniqueValues(fileNames)}`);

    // Task 2: Determine how many usernames occur in all 20 files
    console.log(`Usernames occurring in all 20 files: ${await existInAllFiles(fileNames)}`);

    // Task 3: Find out how many usernames occur in at least 10 files
    console.log(`Usernames occurring in at least 10 files: ${await existInAtleastTen(fileNames)}`);

    console.log("The tasks needed " + (Date.now() - startTime) + "ms to complete\n");
})();
