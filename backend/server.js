// backend/server.js

// 1. Importar os pacotes que instalamos
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// 2. Configurar o servidor web
const app = express();
const PORT = 3000; // A porta que nosso backend vai "escutar"

// Middlewares: "plugins" que ajudam nosso servidor a funcionar direito
app.use(express.json()); // Permite que o servidor entenda dados em formato JSON
app.use(cors());         // Permite que seu site (frontend) possa conversar com este servidor

app.use(express.static('public')); // Permite servir arquivos estáticos (imagens, css, etc)

// 3. Conectar ao banco de dados SQLite
// Isso vai criar um arquivo chamado 'penicius.db' na sua pasta 'backend'
const db = new sqlite3.Database('./penicius.db', (err) => {
    if (err) {
        // Se der erro ao conectar, mostra no console
        console.error("Erro ao abrir o banco de dados:", err.message);
    } else {
        console.log("Conectado com sucesso ao banco de dados 'penicius.db'");
        // Depois de conectar, manda ele criar a tabela de usuários (se ela ainda não existir)
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                // Se der erro ao criar a tabela, mostra no console
                console.error("Erro ao criar a tabela 'usuarios':", err.message);
            }
        });
    }
});

// --- 4. CRIANDO AS ROTAS DA API (os "endpoints" que o frontend vai chamar) ---

// ROTA DE CADASTRO (CREATE do CRUD)
// Quando o frontend mandar um POST para '/api/register', este código vai rodar
app.post('/api/register', (req, res) => {
    const { nome, email, senha } = req.body; // Pega os dados que o frontend enviou

    // Validação simples para ver se tudo foi preenchido
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos." });
    }

    // O comando SQL para inserir um novo usuário na tabela
    const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;

    // Executa o comando SQL no banco de dados
    db.run(sql, [nome, email, senha], function(err) {
        if (err) {
            // Se o email já existir, o 'UNIQUE' da tabela vai dar um erro
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Este email já está cadastrado." });
            }
            // Para outros erros de servidor
            return res.status(500).json({ error: err.message });
        }
        // Se deu tudo certo
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
});

// ROTA DE LOGIN (READ do CRUD)
// Quando o frontend mandar um POST para '/api/login', este código vai rodar
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body; // Pega email e senha enviados

    // O comando SQL para encontrar um usuário com aquele email E aquela senha
    const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

    // Executa a busca no banco de dados
    db.get(sql, [email, senha], (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (usuario) {
            // Se encontrou o usuário, manda uma resposta de sucesso com os dados dele
            res.status(200).json({
                message: "Login realizado com sucesso!",
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });
        } else {
            // Se não encontrou ninguém com aquele email e senha
            res.status(401).json({ error: "Email ou senha inválidos." });
        }
    });
});


// 5. Iniciar o servidor
// Manda o servidor começar a "escutar" na porta que definimos (3000)
app.listen(PORT, () => {
    console.log(`Servidor rodando e ouvindo na porta http://localhost:${PORT}`);
});