// backend/server.js
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken'); // Para JWT (Punto 3 y 4)
require('dotenv').config(); // Para cargar JWT_SECRET desde .env

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET; 

// --- 1. MIDDLEWARES GLOBALES ---
// Permite a Express leer el cuerpo de las peticiones POST en formato JSON
app.use(express.json());

// --- 2. SERVIR ARCHIVOS ESTÁTICOS (Punto 2) ---
// Sirve la carpeta 'data' bajo la ruta '/api'
app.use('/api', express.static(path.join(__dirname, 'data')));

// --- 3. ENDPOINT DE LOGIN (POST /login) (Punto 3) ---
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Debe ingresar usuario y contraseña.' });
    }

    // SIMULACIÓN DE AUTENTICACIÓN
    if (username === 'test' && password === '123') { 
        
        const payload = {
            id: username, 
            role: 'usuario_autenticado'
        };

        // Generar el Token JWT
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

        return res.json({ 
            message: 'Login exitoso. Token generado.', 
            token: token 
        });

    } else {
         return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
});


// --- 4. MIDDLEWARE DE AUTORIZACIÓN (Punto 4) ---
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    // Verificar formato: 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Acceso denegado. Token requerido (Bearer format).' });
    }
    
    const token = authHeader.split(' ')[1];

    // Verificar y validar el token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado.', error: err.message });
        }
        
        req.user = decoded; 
        next(); 
    });
};


// --- 5. EJEMPLO DE RUTA PROTEGIDA (Prueba del Punto 4) ---
// Protegemos el producto individual con ID 40281 (según tu estructura de archivos)
app.get('/api/protected/products/40281.json', verifyToken, (req, res) => {
    
    // Ruta corregida para tu estructura: data/emercado-api-main/products/40281.json
    const filePath = path.join(__dirname, 'data', 'emercado-api-main', 'products', '40281.json'); 
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error al enviar archivo protegido:", err.message);
            // Si el archivo no se encuentra, devolvemos un 404
            res.status(404).json({ message: "Archivo de producto no encontrado en la ruta interna del servidor." });
        }
    });
});


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Backend de eCommerce Funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});