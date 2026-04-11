FROM ubuntu:24.04

# Actualizar paquetes e instalar herramientas necesarias
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    net-tools \
    iputils-ping && \
    rm -rf /var/lib/apt/lists/*

# Descargar e instalar Node.js 16
RUN cd ~ && curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh && \
    bash /tmp/nodesource_setup.sh && \
    apt install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Actualizar npm a versión 9.6.6
RUN npm install -g npm@9.6.6

# Crear directorios de trabajo
RUN mkdir -p /app/servidor /app/cliente

# Copiar proyectos
COPY server /app/servidor
COPY cliente/app-regg /app/cliente

# Instalar dependencias del cliente
WORKDIR /app/cliente
RUN npm install

# Instalar dependencias del servidor
WORKDIR /app/servidor
RUN npm install

# Exponer puertos
EXPOSE 3000
EXPOSE 8080
EXPOSE 9229

# Iniciar el cliente en modo desarrollo
# Para depuración, usar --inspect para el servidor si es necesario
CMD ["npm", "start"]
