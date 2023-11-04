const express = require('express');
const app = express();
const csvFilePath = './IP2LOCATION-LITE-DB1.CSV';

app.use(express.json());
app.set('trust proxy', true);

app.get('/detect-ip', (req, res) => {
    const userIP = inet_aton(req.ip)
    const csvData = require('fs').readFileSync(csvFilePath, 'utf8').split('\n');
    for (const row of csvData) {
        let [from, to, countryCode, countryName] = row.split(',');
        countryName = countryName.replace(/\\|\"|\r/g, '');
        countryCode = countryCode.replace(/\\|\"|\r/g, '');
        if(from){
            from = +(from.split("\"")[1])
            to = +(to.split("\"")[1])
        }
        if (userIP >= from && userIP <= to) {
            return res.json(`User adress is in range from ${inet_ntoa(from)} to ${inet_ntoa(to)} and belongs to ${countryName} (${countryCode})`);
        }
    }
    res.status(404).json({ error: `IP ${userIP} not found in the database` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function inet_aton(ip){
    var a = ip.split('.');
    var buffer = new ArrayBuffer(4);
    var dv = new DataView(buffer);
    for(var i = 0; i < 4; i++){
        dv.setUint8(i, a[i]);
    }
    return(dv.getUint32(0));
}

function inet_ntoa(num){
    var nbuffer = new ArrayBuffer(4);
    var ndv = new DataView(nbuffer);
    ndv.setUint32(0, num);

    var a = new Array();
    for(var i = 0; i < 4; i++){
        a[i] = ndv.getUint8(i);
    }
    return a.join('.');
}