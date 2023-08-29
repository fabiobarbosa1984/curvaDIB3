# Definir a imagem base
FROM node:14

# Criar e definir o diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar os arquivos necessários para o container
COPY package*.json ./
COPY app/app.js ./

# Instalar as dependências
RUN npm install

# Definir o comando para iniciar a aplicação
CMD ["node", "app/app.js"]
