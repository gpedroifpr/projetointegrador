// backend/server.js

// 1. Importar os pacotes
const express = require('express');
const mysql = require('mysql2'); // Usando o novo pacote
const cors = require('cors');

// 2. Configurar o servidor web
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 3. Conectar ao banco de dados MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',  // <<-- COLOQUE A SENHA DO SEU MYSQL AQUI
    database: 'penicius'   // Usando o nome do banco que você criou
}).promise();

// --- 4. ROTAS DA API ATUALIZADAS PARA MYSQL ---

// ROTA DE CADASTRO (CREATE)
app.post('/api/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos." });
    }

    const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;

    try {
        await db.query(sql, [nome, email, senha]);
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Este email já está cadastrado." });
        }
        console.error("Erro no banco de dados:", err);
        return res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
});

// ROTA DE LOGIN (READ)
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

    try {
        const [results] = await db.query(sql, [email, senha]);

        if (results.length > 0) {
            const usuario = results[0];
            res.status(200).json({
                message: "Login realizado com sucesso!",
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });
        } else {
            res.status(401).json({ error: "Email ou senha inválidos." });
        }
    } catch (err) {
        console.error("Erro no banco de dados:", err);
        return res.status(500).json({ error: "Erro ao tentar fazer login." });
    }
});

// 5. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando e ouvindo na porta http://localhost:${PORT}`);
    console.log("Conectado com sucesso ao banco de dados MySQL 'penicius'");
});