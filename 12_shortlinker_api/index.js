import express from 'express';
import {customAlphabet} from 'nanoid';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.json());

const dataFolder = "./data";
const port = process.env.PORT || 3000;

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 4);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong'
    });
});

app.post('/shorten', (req, res) => {
    const {link} = req.body;

    if (!link || typeof link !== 'string' || !isValidURL(link)) {
        return res.status(400).json({
            error: 'Invalid URL'
        });
    }

    const unicalId = nanoid()
    const shortLink = `http://localhost:${port}/${unicalId}`;
    const fileName = `${unicalId}.json`;
    const filePath = path.join(dataFolder, fileName);

    fs.writeFile(filePath, JSON.stringify({
        originalLink: link
    }), (err) => {
        if (err) {
            return res.status(500).json({
                error: 'Failed to store JSON document'
            });
        }
        res.status(201).json({shortLink});
    });
});

app.get('/:shortLink', (req, res) => {
    const {shortLink} = req.params;
    const fileName = `${shortLink.substring(shortLink.lastIndexOf('/') + 1)}.json`;
    const filePath = path.join(dataFolder, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({
                error: 'Shortened link not found'
            });
        }
        const jsonData = JSON.parse(data);
        res.redirect(jsonData.originalLink);
    });
});

function isValidURL(url) {
    const pattern = /^((http|https|ftp):\/\/)(www\.)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})(\/[a-zA-Z0-9-._?&=]*)*$/;
    return pattern.test(url);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});