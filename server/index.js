const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const swaggerUi = require('swagger-ui-express');

const isTest = process.env.NODE_ENV === 'test';

const sequelize = isTest
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'tododb',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || 'secret',
      {
        host: process.env.DB_HOST || 'mariadb',
        port: process.env.DB_PORT || 3306,
        dialect: 'mariadb',
        logging: false,
      }
    );

const TooDo = sequelize.define('TooDo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  texto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'todos',
  timestamps: false,
});

const app = express();
const router = express.Router();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.get('/texto', function(req, res) {
  res.status(200).json({ otherText: 'one text' });
});

router.post('/texto', async function(req, res) {
  const texto = req.body.text;
  console.log(JSON.stringify(req.body));

  if (typeof texto !== 'string' || !texto.trim()) {
    return res.status(400).json({ error: 'Se requiere el campo text' });
  }

  try {
    const nuevoTexto = await TooDo.create({ texto: texto.trim() });
    return res.status(200).json({ id: nuevoTexto.id, texto: nuevoTexto.texto });
  } catch (error) {
    console.error('Error al guardar en MariaDB:', error);
    return res.status(500).json({ error: 'No se pudo guardar el texto', details: error.message });
  }
});

router.post('/todo', async function(req, res) {
  const texto = req.body.texto;

  if (typeof texto !== 'string' || !texto.trim()) {
    return res.status(400).json({ error: 'Se requiere el campo texto' });
  }

  try {
    const todo = await TooDo.create({ texto: texto.trim() });
    return res.status(200).json({ id: todo.id, texto: todo.texto });
  } catch (error) {
    console.error('Error al guardar TooDo en MariaDB:', error);
    return res.status(500).json({ error: 'No se pudo crear TooDo', details: error.message });
  }
});

router.get('/todos', async function(req, res) {
  try {
    const list = await TooDo.findAll();
    return res.status(200).json(list);
  } catch (error) {
    console.error('Error al obtener TooDos:', error);
    return res.status(500).json({ error: 'No se pudo obtener la lista de TooDos', details: error.message });
  }
});

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API de TooDo',
    version: '1.0.0',
    description: 'Documentación OpenAPI para endpoint new.TooDo y el modelo TooDo',
  },
  servers: [{ url: 'http://localhost:8080' }],
  paths: {
    '/todo': {
      post: {
        tags: ['TooDo'],
        summary: 'Crear una nueva TooDo',
        operationId: 'new.TooDo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  texto: { type: 'string', example: 'Comprar pan' },
                },
                required: ['texto'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'TooDo creada correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    texto: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Solicitud inválida' },
          '500': { description: 'Error interno del servidor' },
        },
      },
    },
    '/todos': {
      get: {
        tags: ['TooDo'],
        summary: 'Listar todas las TooDos',
        operationId: 'list.TooDo',
        responses: {
          '200': {
            description: 'Lista de TooDos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      texto: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          '500': { description: 'Error interno del servidor' },
        },
      },
    },
  },
  components: {
    schemas: {
      TooDo: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          texto: { type: 'string' },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/openapi.json', (req, res) => res.json(swaggerDocument));

// Usar el router primero para las rutas API
app.use(router);

// Luego servir archivos estáticos del cliente
const buildPath = path.join(__dirname, '../cliente/build');
app.use(express.static(buildPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;

if (!isTest) {
  sequelize.authenticate().then(() => {
    console.log('MariaDB ORM conectado');
    return TooDo.sync();
  }).then(() => {
    console.log('Modelo TooDo sincronizado');
    app.listen(PORT, function() {
      console.log('My http server listening on port ' + PORT + '...');
    });
  }).catch(error => {
    console.error('Error al conectar con MariaDB:', error);
  });
}

module.exports = { app, sequelize, TooDo };
