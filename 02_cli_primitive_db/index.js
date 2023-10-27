import inquirer from 'inquirer';
import fs from "fs";

let userArr = JSON.parse(fs.readFileSync('./database.txt'));

async function addUser() {
    const user = (await inquirer.prompt({
        name: "user",
        type: "input",
        message: "Enter the user's name. To cancel, press ENTER: "
    })).user;

    if (user) {
        const gender = (await inquirer.prompt({
            name: "gender",
            type: "list",
            message: "Choose your gender: ",
            choices: ["Male", "Female", "Non-Binary"]
        })).gender;

        const age = (await inquirer.prompt({
            name: "age",
            type: "number",
            message: "Enter your age: "
        })).age;

        userArr.push({ "user": user, "gender": gender, "age": +age });
        return user
    }
}

async function searchUser() {
    const userToFind = (await inquirer.prompt({
        name: "user",
        type: "input",
        message: "Enter the user's name you want to find in the DB. To cancel, press ENTER: "
    })).user;

    if (userToFind) {
        const foundUsers = userArr.filter(element => element.user.toLowerCase() === userToFind.toLowerCase());

        if (foundUsers.length > 0) {
            console.log(`User ${userToFind} was found:`);
            foundUsers.forEach(user => console.log(user));
        } else {
            console.log("No user with that name found.");
        }
    }
    return userToFind;
}

let user;
do {
    user = await addUser();
} while (user);

fs.writeFileSync("./database.txt", JSON.stringify(userArr, null, 2), (err) => {
    if (err) return console.log(err);
});

const readDB = (await inquirer.prompt({
    name: "readDB",
    type: "list",
    message: "Would you like to search for values in the DB?: ",
    choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
    ]
})).readDB;

if (readDB) {
    console.log(userArr);
    do {
        user = await searchUser();
    } while (user);
}
