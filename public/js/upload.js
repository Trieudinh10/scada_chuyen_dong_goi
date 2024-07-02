const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('excelFile'), (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    data.forEach(row => {
        const query = 'INSERT INTO your_table (column1, column2, column3) VALUES (?, ?, ?)';
        const values = [row['Column1'], row['Column2'], row['Column3']];
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err.stack);
            }
        });
    });

    res.send('File uploaded and data inserted successfully.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
