const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
rl.on('close', () => process.exit(0));

// Implementing arrow function for async I/O support
(async() => {
  try {
    
    let commandArr = [
        "1 - Sort words alphabetically",
        "2 - Show numbers from lesser to greater",
        "3 - Show numbers from bigger to smaller", 
        "4 - Display words in ascending order by number of letters in the word", 
        "5 - Show only unique words",
        "6 - Display only unique values from the set of words and numbers entered by the user",
        "exit - Exit app"
    ]
    let command;

    do{
        let userInput = await prompt("\nHello! Enter 10 words or digits deviding them in spaces: ");
        userInput = userInput.split(" ")
        if(userInput.length < 10){
            console.log("\nYou need to enter 10 words or digits to continue!")
            continue;
        }

        // Commands output (resizable through array)
        commandArr.forEach(element => {
            console.log("\n"+element)
        });
        command = await prompt("\nEnter command number (\"exit\" for exit): ");

        console.log(doCommand(userInput, command));

    }while(command != "exit");
    
    rl.close(); // Exit app

  } catch (e) {
    console.error("Prompt", e);
  }
})();

function doCommand(userInput, command){
    
    let integerArray = userInput.filter(Number)
    let wordsArray = userInput.filter((element) => {return /[^\d\W]/.test(element)})

    switch(command){
        case "1":
            return wordsArray.map(element => {return element.toLowerCase()}).sort()
        case "2":
            return integerArray.sort((a, b) => {return a-b})
        case "3":
            return integerArray.sort((a, b) => {return b-a})
        case "4":
            return wordsArray.sort((a, b) => {return a.length-b.length})
        case "5":
            return findUniqueInArray(wordsArray)
        case "6":
            return findUniqueInArray(userInput)
        default:
            return "False command, try another input";
    }
}

function findUniqueInArray(array){
    let elementsMap = new Map()
    array.map(element => {elementsMap.set(element.toLowerCase(), null)})
    return Array.from(elementsMap.keys())
}