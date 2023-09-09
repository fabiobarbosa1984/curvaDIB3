# Definir a imagem base
FROM node:14

# Criar e definir o diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar os arquivos necessários para o container
COPY package*.json ./

# Instalar as dependências
RUN npm install

#copia a aplicação apenas após o npm install para otimizar a construção
COPY app/* ./

# Definir o comando para iniciar a aplicação
CMD ["node", "app.js"]
