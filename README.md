# node8-doker
Proyecto con Node.js 20, React y Express en contenedor Docker.

## Cambios Realizados

### Migración de Dependencias y Seguridad

- **Node.js 20 LTS**: Actualización del runtime a Node.js 20 para compatibilidad con las versiones seguras de las dependencias (especialmente `serialize-javascript@^7.0.5`).
- **React 17 y React-Scripts 5.0.1**: Cliente actualizado a versiones más modernas y seguras.
- **Eliminación de dependencias vulnerables en el servidor**:
  - Removidas: `superagent`, `supertest`, `chai`, `mocha` (paquetes de testing no utilizados que contenían vulnerabilidades transitivas).
  - Mantenidas solo las dependencias esenciales: `express`, `body-parser`, `bootstrap`, `jquery`, `@popperjs/core`, `popper.js`.
- **Overrides de dependencias en el cliente**: Se agregaron overrides para asegurar versiones seguras:
  - `serialize-javascript@^7.0.5` (corrige vulnerabilidad RCE)
  - `postcss@^8.4.31` (corrige vulnerabilidad de parsing)
  - `underscore@^1.13.8` (corrige vulnerabilidad de recursión)
  - `jsonpath@^1.1.2` (corrige vulnerabilidad via underscore)
  - Otros: `nth-check@^2.0.1`, `shell-quote@^1.7.3`, `loader-utils@^1.4.2`

### Correción de Rutas

- **Servidor**: Las rutas API (`/texto`) ahora se procesan ANTES de servir archivos estáticos.
- **Cliente en raíz**: La aplicación React se sirve en `/` en lugar de `/main`.
- **API relativa**: El cliente ahora usa URLs relativas para llamadas a la API, permitiendo que funcione tanto en desarrollo como en producción.

## Cómo Usar la App

### Opción 1: Con Docker Compose (Recomendado)

1. Construir y levantar:
   ```bash
   docker-compose build
   docker-compose up
   ```

2. Acceder a la aplicación:
   - En el navegador: `http://localhost:8080/`
   - O por IP del contenedor: `http://192.168.70.44:8080/`

3. Usar la aplicación:
   - **Agregar TODO**: Escribe en el campo de texto y presiona Enter o haz click en el botón
   - **Ver TODOs**: Se muestran en la lista debajo
   - **Sincronización**: Los datos se guardan en Redux y se sincronizan con el servidor via API `/texto`

### Opción 2: Desarrollo Local

**Cliente:**
```bash
cd cliente/app-regg
npm install
npm start  # Se abre en http://localhost:3000
```

**Servidor (en otra terminal):**
```bash
cd server
npm install
npm start  # En http://localhost:8080
```


```bash
git clone https://github.com/etRegg/node8-doker.git
cd node8-doker
```

## Uso del Contenedor

### Construir y Levantar el Contenedor

1. Construye la imagen:
   ```bash
   docker-compose build
   ```

2. Levanta el contenedor:
   ```bash
   docker-compose up
   ```

El contenedor ejecuta el servidor Express en el puerto 8080 interno, y expone los puertos 3000 (cliente React dev) y 8080 (servidor).

### Acceder al Contenedor

- **Aplicación React**: Servida por el servidor en `http://localhost:8080/` (producción).
- **Servidor Express**: Escucha en el puerto 8080, expone APIs en `/texto`.

### Acceder por la IP del Contenedor

La IP del contenedor es `192.168.70.44` (configurada en `docker-compose.yml`).

- **Aplicación React**: `http://192.168.70.44:8080/`
- **API GET /texto**: `http://192.168.70.44:8080/texto` (devuelve `{"otherText": "one text"}`)
- **API POST /texto**: `http://192.168.70.44:8080/texto` (recibe y devuelve JSON con "text")

### Uso de la API con curl

#### GET /texto
```bash
curl http://192.168.70.44:8080/texto
```
Respuesta: `{"otherText": "one text"}`

#### POST /texto
```bash
curl -X POST http://192.168.70.44:8080/texto \
  -H "Content-Type: application/json" \
  -d '{"text": "tu mensaje aquí"}'
```
Respuesta: `{"text": "tu mensaje aquí"}`

### Ejecutar Tests Unitarios

Los tests unitarios están implementados con Jest y Supertest, usando SQLite en memoria para las pruebas.

#### Tests incluidos:
- **Funcionalidad básica**: Creación, validación y listado de TooDos
- **Seguridad**: Tests de ataques de inyección conocidos:
  - SQL Injection: `' OR '1'='1`, `'; DROP TABLE todos; --`, `' UNION SELECT * FROM users; --`
  - XSS: `<script>alert('xss')</script>`, `<img src=x onerror=alert('xss')>`
  - Command Injection: `test; rm -rf /`, `test | cat /etc/passwd`
  - Path Traversal: `../../../etc/passwd`, `..%2F..%2F..%2Fetc%2Fpasswd`

#### Los tests se ejecutan automáticamente al iniciar el contenedor:
```bash
docker compose up
```

#### Ejecutar tests manualmente:
```bash
docker compose exec webapp npm test
```

#### Ejecutar tests en modo watch:
```bash
docker compose exec webapp npm run test:watch
```

Los tests pasan **17 casos** incluyendo validaciones de seguridad. Al finalizar, la base de datos de test se limpia completamente.

### Configuración de Proyectos en el Contenedor

- **Cliente React** (`/app/cliente`): Aplicación construida con `npm run build`, servida estáticamente desde `/app/servidor/../cliente/build`.
- **Servidor Express** (`/app/servidor`): API con rutas GET/POST para texto, CORS habilitado para todas las origines, logs de tiempo en consola para cada request.

El contenedor combina ambos: el servidor sirve la app React en `/` y expone las APIs en `/texto`.

### Entrar al Contenedor

```bash
docker exec -it node8-doker_webapp_1 /bin/bash
```

Dentro del contenedor:
- Servidor: `/app/servidor`
- Cliente: `/app/cliente`

### Logs del Servidor

Al levantar el contenedor, verás logs como:
```
My http server listening on port 8080...
Time: [timestamp]
```

## Desarrollo Local

### Cliente React

```bash
cd cliente/app-regg
npm install
npm start  # Dev server en http://localhost:3000
```

### Servidor Express

```bash
cd server
npm install
npm start  # Servidor en http://localhost:8080
```

## Notas

- El cliente se construye automáticamente en el contenedor.
- El contenedor usa Node.js 20 LTS para compatibilidad con las versiones seguras de las dependencias.
- Las dependencias del servidor han sido minimizadas para reducir vulnerabilidades, eliminando paquetes de testing no utilizados.
- Para desarrollo con hot-reload, descomenta los volúmenes en `docker-compose.yml`.
