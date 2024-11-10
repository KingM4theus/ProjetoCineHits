const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('cinehits.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario TEXT NOT NULL,
    senha TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    filme_id INTEGER,
    comentario TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
)`);

app.post('/register', (req, res) => {
    const { nome_usuario, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 8);

    const sql = 'INSERT INTO usuarios (nome_usuario, senha) VALUES (?, ?)';
    db.run(sql, [nome_usuario, hashedPassword], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'User registered', id: this.lastID });
    });
});

app.post('/login', (req, res) => {
    const { nome_usuario, senha } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE nome_usuario = ?';
    db.get(sql, [nome_usuario], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row || !bcrypt.compareSync(senha, row.senha)) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        res.send({ message: 'Login successful', user: row });
    });
});

app.post('/comentario', (req, res) => {
    const { id_usuario, filme_id, comentario } = req.body;
    const sql = 'INSERT INTO comentarios (id_usuario, filme_id, comentario) VALUES (?, ?, ?)';
    db.run(sql, [id_usuario, filme_id, comentario], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'Comment added', id: this.lastID });
    });
});

app.get('/comentarios/:filme_id', (req, res) => {
    const filmeId = req.params.filme_id;
    const sql = 'SELECT c.*, u.nome_usuario FROM comentarios c JOIN usuarios u ON c.id_usuario = u.id WHERE c.filme_id = ?';
    db.all(sql, [filmeId], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});















