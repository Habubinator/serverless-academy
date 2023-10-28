const axios = require("axios")
const {weatherApiToken} = require("./config/config").getEnv()

async function findForecast(interval){

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                "lat": 46.482952,
                "lon": 30.712481,
                "appid": weatherApiToken
            }
    });

    const weatherDataArr = response.data.list;

    const step = interval / 3 === 1 ? 1 : 2;
    let result = "";

    for (let i = 0; i < weatherDataArr.length; i += step) {

        let date = convertTimestamptoTime(weatherDataArr[i].dt)
        let degrees = (weatherDataArr[i].main.temp - 273.15).toFixed(2)
        let wind = weatherDataArr[i].wind.speed.toFixed(2)
        let weatherEmoji = findWeatherEmoji(weatherDataArr[i].weather[0].main)

        result += `${date} - 🌡️ ${degrees} °C 💨 ${wind} Km/h ${weatherEmoji}\n`;
    }

    return result;

}

function convertTimestamptoTime(unixTimestamp) {

    let dateObj = new Date(unixTimestamp * 1000);
    let utcString = dateObj.toUTCString();
    let time = utcString.slice(5, 12) + utcString.slice(-12, -7);

    return time;

}

function findWeatherEmoji(condition) {
    const emojis = {
        "Thunderstorm": "⛈",
        "Drizzle": "🌦",
        "Rain": "🌧",
        "Snow": "❄️",
        "Clear": "☀️",
        "Clouds": "⛅️",
    };
    return emojis[condition] || "🌫";
}

module.exports = findForecast