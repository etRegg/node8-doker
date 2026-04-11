# node8-doker
Proyecto con Node.js 16, React y Express en contenedor Docker.

## Clonar

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

- **Aplicación React**: Disponible en `http://localhost:3000` (si se ejecuta el dev server) o servida por el servidor en `http://localhost:8080/`.
- **Servidor Express**: Escucha en el puerto 8080 del contenedor.

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

### Configuración de Proyectos en el Contenedor

- **Cliente React** (`/app/cliente`): Aplicación construida con `npm run build`, servida estáticamente desde `/app/servidor/../cliente/build`.
- **Servidor Express** (`/app/servidor`): API con rutas GET/POST para texto, CORS habilitado para todas las origines, logs de tiempo en consola para cada request.

El contenedor combina ambos: el servidor sirve la app React en `/main` y expone las APIs en `/texto`.

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
- La vulnerabilidad de `serialize-javascript` ha sido corregida removiendo el paquete.
- Para desarrollo con hot-reload, descomenta los volúmenes en `docker-compose.yml`.
