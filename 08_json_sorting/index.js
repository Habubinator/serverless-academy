const axios = require("axios");
const fs = require("fs").promises;

const endpointsFile = "endpoints.txt";

async function findIsDone(obj) {
    try {

        if (obj.isDone !== undefined) {

            return obj.isDone;

        } else if (typeof obj === "object") {

            for (const key in obj) {

                const isDone = await findIsDone(obj[key]);
                if (isDone !== undefined) {
                    return isDone;
                }

            }

        }

    } catch (error) {

        console.log("Error with json file: " + error);

    }
}
  
  
  
async function fetchEndpoint(url, retry = 3) {

    try {

        const response = await axios.get(url);
        const isDone = await findIsDone(response.data);
        
        return [true, isDone];

    } catch (error) {

        if (retry > 0) {
            // console.log(`Retrying ${url}. Remaining retries: ${retry}`);
            return fetchEndpoint(url, retry - 1);
        } else {
            console.log(`[Fail] ${url}: The endpoint is unavailable`);
            return [false, undefined];
        }

    }

}
  

(async () => {

    try {
        const endpointList = await fs.readFile(endpointsFile, "utf-8");
        const endpoints = endpointList.split("\n");

        let trueCount = 0;
        let falseCount = 0;

        for (let endpoint of endpoints) {

            endpoint = endpoint.trim()
            const [success, isDone] = await fetchEndpoint(endpoint);

            if (success) {

                console.log(`[Success] ${endpoint}: isDone - ${isDone}`);

                if (isDone === true) {
                    trueCount++;
                } else if (isDone === false) {
                    falseCount++;
                }

            }
        }

        console.log(`Found True values: ${trueCount}`);
        console.log(`Found False values: ${falseCount}\n`);

    } catch (error) {

        console.error("An error occurred:", error);
  
    }

})();
