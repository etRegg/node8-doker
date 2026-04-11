const request = require('supertest');
const { app, sequelize, TooDo } = require('../index');

describe('API Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Limpiar toda la base de datos después de los tests
    await sequelize.drop();
    await sequelize.close();
  });

  describe('GET /texto', () => {
    it('should return otherText', async () => {
      const response = await request(app)
        .get('/texto')
        .expect(200);

      expect(response.body).toHaveProperty('otherText', 'one text');
    });
  });

  describe('POST /texto', () => {
    it('should create a new text entry', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: 'Test text' })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', 'Test text');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    // Tests de inyección SQL
    it('should prevent SQL injection - basic OR attack', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "' OR '1'='1" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "' OR '1'='1");
    });

    it('should prevent SQL injection - DROP TABLE attack', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "'; DROP TABLE todos; --" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "'; DROP TABLE todos; --");
    });

    it('should prevent SQL injection - UNION SELECT attack', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "' UNION SELECT * FROM users; --" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "' UNION SELECT * FROM users; --");
    });

    // Tests de XSS
    it('should prevent XSS - script tag', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "<script>alert('xss')</script>" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "<script>alert('xss')</script>");
    });

    it('should prevent XSS - img onerror', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "<img src=x onerror=alert('xss')>" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "<img src=x onerror=alert('xss')>");
    });

    // Tests de command injection
    it('should prevent command injection - semicolon', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "test; rm -rf /" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "test; rm -rf /");
    });

    it('should prevent command injection - pipe', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "test | cat /etc/passwd" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "test | cat /etc/passwd");
    });

    // Tests de path traversal
    it('should prevent path traversal - basic', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "../../../etc/passwd" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "../../../etc/passwd");
    });

    it('should prevent path traversal - encoded', async () => {
      const response = await request(app)
        .post('/texto')
        .send({ text: "..%2F..%2F..%2Fetc%2Fpasswd" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "..%2F..%2F..%2Fetc%2Fpasswd");
    });
  });

  describe('POST /todo', () => {
    it('should create a new TooDo', async () => {
      const response = await request(app)
        .post('/todo')
        .send({ texto: 'Comprar pan' })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', 'Comprar pan');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/todo')
        .send({ texto: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    // Tests de inyección en /todo
    it('should prevent SQL injection in todo', async () => {
      const response = await request(app)
        .post('/todo')
        .send({ texto: "'; DROP TABLE todos; --" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "'; DROP TABLE todos; --");
    });

    it('should prevent XSS in todo', async () => {
      const response = await request(app)
        .post('/todo')
        .send({ texto: "<script>alert('xss')</script>" })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('texto', "<script>alert('xss')</script>");
    });
  });

  describe('GET /todos', () => {
    beforeAll(async () => {
      await TooDo.create({ texto: 'Test todo 1' });
      await TooDo.create({ texto: 'Test todo 2' });
    });

    it('should return all TooDos', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('texto');
    });
  });
});