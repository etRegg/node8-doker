FROM ubuntu:24.04

# Actualizar paquetes e instalar herramientas necesarias
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    net-tools \
    iputils-ping && \
    rm -rf /var/lib/apt/lists/*

# Descargar e instalar Node.js 20
RUN cd ~ && curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh && \
    bash /tmp/nodesource_setup.sh && \
    apt install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Actualizar npm a una versión compatible con Node 20
RUN npm install -g npm@10

# Crear directorios de trabajo
RUN mkdir -p /app/servidor /app/cliente

# Limpieza adicional (por si hay archivos residuales)
RUN rm -rf /app/servidor /app/cliente && mkdir -p /app/servidor /app/cliente

# Copiar proyectos
COPY server /app/servidor
COPY cliente/app-regg /app/cliente

# Limpiar node_modules y package-lock del servidor para evitar conflictos
RUN rm -rf /app/servidor/node_modules /app/servidor/package-lock.json /app/servidor/.npm

# Instalar dependencias del servidor primero (más pequeñas)
WORKDIR /app/servidor
RUN npm cache clean --force && npm install

# Instalar dependencias del cliente
WORKDIR /app/cliente
RUN npm cache clean --force && npm install

# Exponer puertos
EXPOSE 3000
EXPOSE 8080
EXPOSE 9229

# Iniciar el servidor Express en /app/servidor
WORKDIR /app/servidor
CMD ["npm", "start"]
