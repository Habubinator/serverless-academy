const NodeCache = require( "node-cache" );
const myCache = new NodeCache({useClones: false});
const axios = require("axios")

async function findExchange(bankName, currencyCode){

    switch(bankName){

        case "Privat":

            response = myCache.get("PrivatResponce");
            if (!response){
                response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11');
                myCache.set("PrivatResponce", response, 300);
            }

            pos = ['EUR', 'USD'].indexOf(currencyCode)
            if(pos == -1)   throw new Error("Not supported currencyCode. Try 'USD' or 'EUR'");

            emoji = currencyCode == "USD"? "🇺🇸" : "🇪🇺"; 

            return `${emoji} Buy: ${(+response.data[pos].buy).toFixed(2)} Sell: ${(+response.data[pos].sale).toFixed(2)} \n`;

        case "Mono":
            
            response = myCache.get("MonoResponce");
            if (!response){
                response = await axios.get('https://api.monobank.ua/bank/currency');
                myCache.set("MonoResponce", response, 300);
            }
            
            pos = ['EUR', 'USD'].indexOf(currencyCode)
            if(pos == -1){
                throw new Error("Not supported currencyCode. Try 'USD' or 'EUR'");
            }
            else{
                var currency = pos == 1? 840 : 978
            }
            
            let excangeData = response.data.filter((value)=>{
                return value.currencyCodeB == 980 && value.currencyCodeA == currency
            });

            emoji = currencyCode == "USD"? "🇺🇸" : "🇪🇺"; 

            return `${emoji} Buy: ${excangeData[0].rateBuy.toFixed(2)} Sell: ${excangeData[0].rateSell.toFixed(2)} \n`;

        default :
            throw new Error("Not supported bank name. Try 'Privat' or 'Mono'.")
    }
}

module.exports = findExchange