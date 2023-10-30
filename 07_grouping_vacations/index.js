const fs = require("fs");

let data = JSON.parse(fs.readFileSync("data.json", "utf8"));

let vacancyMap = new Map()
let userIdMap = new Map()
let result = new Array()

data.forEach(element => {
    
    let id = element["user"]["_id"];
    let userName = element["user"]["name"]

    userIdMap.set(id,userName)

    if(vacancyMap.has(id)){

        vacancyMap.get(id).push({"startDate" : element["startDate"],"endDate" : element["endDate"]})

    }else{

        vacancyMap.set(id,[{"startDate" : element["startDate"],"endDate" : element["endDate"]}])

    }
});

userIdMap.forEach((value, key) =>{

    result.push({
        "userId": key,
        "userName": value,
        "vacations": vacancyMap.get(key)
    })

})

fs.writeFileSync("./result.json", JSON.stringify(result, null, 2), (err) => {
    if (err) return console.log(err);
});