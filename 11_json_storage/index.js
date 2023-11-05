const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json())

const dataFolder = path.join(__dirname, 'data');

app.put('/:json_path', (req, res) => {
    const jsonPath = req.params.json_path;
    const jsonDocument = req.body;
    const filePath = path.join(dataFolder, `${jsonPath}.json`);

    fs.writeFile(filePath, JSON.stringify(jsonDocument, null, 2), (err) => {
        if (err) {
            return res.status(500).json({
                error: 'Failed to store JSON document'
            });
        }
        res.status(201).json({
            message: 'JSON document stored successfully'
        });
    });
});

app.get('/:json_path', (req, res) => {
    const jsonPath = req.params.json_path;
    const filePath = path.join(dataFolder, `${jsonPath}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({
                error: 'JSON document not found'
            });
        }
        const jsonDocument = JSON.parse(data);
        res.status(200).json(jsonDocument);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});