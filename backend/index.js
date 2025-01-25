const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;


// Configura CORS
app.use(cors());
app.use(express.json());



// Conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Ruta para obtener datos de productos
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


app.get('/productos/comparar', async (req, res) => {
    const { nombre } = req.query;
    try {
        const query = `
           SELECT 
                p."Nombre" AS producto,
                p."Precio",
                s.Nombre AS supermercado,
                p."img",
                p."URL",
                similarity(p."Nombre", $1) AS similitud
            FROM 
                "productos" p
            JOIN 
                "supermercados" s 
            ON 
                p."idSupermercado" = s."id"
            WHERE 
                p."Nombre" % $1
            ORDER BY 
                similitud DESC
            LIMIT 8;
        `;
        const result = await pool.query(query, [nombre]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al realizar la comparación' });
    }
});


// Nueva ruta para obtener solo productos con ofertas
app.get('/productos/ofertas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos WHERE "OFF" IS NOT NULL AND "OFF" != \'\'');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos con ofertas' });
    }
});

app.get('/categorias', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id AS categoria_id, 
                c."Nombre" AS categoria_nombre, 
                s.id AS subcategoria_id, 
                s."Nombre" AS subcategoria_nombre 
            FROM 
                "Categorias" c
            LEFT JOIN 
                "Subcategorias" s 
            ON 
                c.id = s."idCategoria"
            ORDER BY 
                c.id, s.id;
        `;

        const result = await pool.query(query);

        // Transformar el resultado para agrupar subcategorías por categoría
        const categorias = {};
        result.rows.forEach(row => {
            if (!categorias[row.categoria_id]) {
                categorias[row.categoria_id] = {
                    id: row.categoria_id,
                    nombre: row.categoria_nombre.trim(),
                    subcategorias: []
                };
            }
            if (row.subcategoria_id) {
                categorias[row.categoria_id].subcategorias.push({
                    id: row.subcategoria_id,
                    nombre: row.subcategoria_nombre.trim()
                });
            }
        });

        res.json(Object.values(categorias));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener categorías y subcategorías' });
    }
});

// subcategorías Y categoría
app.get('/productos/subcategoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM productos WHERE "idSubcategoria" = $1',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos por subcategoría' });
    }
});

app.get('/subcategoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT "Nombre" FROM "Subcategorias" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subcategoría no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la subcategoría' });
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM "Usuarios" WHERE "Email" = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.json({ success: false, message: 'El correo ya está registrado' });
        }
        await pool.query(
            'INSERT INTO "Usuarios" ("Nombre", "Email", "Contraseña", "FechaRegistro") VALUES ($1, $2, $3, NOW())',
            [name, email, password]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM "Usuarios" WHERE "Email" = $1 AND "Contraseña" = $2',
            [email, password]
        );
        if (result.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

