# 🌤️ Projeto Painel Meteorológico Open-Meteo

Este projeto é um **painel meteorológico interativo** desenvolvido com **Node.js**, **HTML**, **CSS** e **JavaScript**, utilizando dados da API [Open-Meteo](https://open-meteo.com/).  
O sistema permite registrar observações meteorológicas diárias (como temperatura, chuva, vento, sensação etc.) e armazená-las em um banco de dados local.

---

## 📖 Sobre o Projeto

O **Projeto Painel Meteorológico Open-Meteo** é uma aplicação web interativa desenvolvida com **HTML**, **CSS**, **JavaScript** e **Node.js**, que consome dados da **Open-Meteo API** para exibir informações meteorológicas em tempo real.

O sistema permite que o usuário:
- Consulte o **clima atual de qualquer cidade** por meio de um **mapa interativo com campo de pesquisa**, facilitando a visualização de diferentes regiões.
- Visualize informações como **temperatura**, **condições do tempo**, **velocidade do vento**, **umidade**, entre outros dados climáticos.
- Registre suas **observações diárias** sobre o clima (como sensações, eventos e anotações pessoais).
- Armazene os registros no **banco de dados local**, podendo listar, editar ou excluir entradas anteriores.
- Navegue por uma **interface moderna, responsiva e intuitiva**, desenvolvida com foco em experiência do usuário.

Além disso, o backend em **Node.js** é responsável por gerenciar as requisições, armazenar os dados meteorológicos e integrar com o banco de dados local (SQLite), garantindo uma comunicação fluida entre o frontend e o servidor.

O projeto foi desenvolvido para estudos e demonstração prática de integração entre **frontend**, **backend** e **API externa**, com foco na exibição de dados climáticos em um painel interativo e dinâmico.

---

## 🚀 Funcionalidades
- Exibição de condições climáticas em tempo real via **Open-Meteo API**.  
- Registro de observações pessoais sobre o clima.  
- Armazenamento local das entradas (data, tags, observações, condições e imagem).  
- Backend em **Node.js** integrado ao banco de dados.  
- Interface moderna e responsiva.

---

## 🎥 Demonstração

![Página Inicial](https://github.com/Caiojosue/img/blob/main/Screenshot%202025-11-12%20at%2017.12.47.png)
![Mapa](https://github.com/Caiojosue/img/blob/main/Screenshot%202025-11-12%20at%2017.13.12.png)

## 🔧 Tecnologias Utilizadas

- Frontend (HTML, CSS, JavaScript): Interface de usuário para visualização das previsões e gerenciamento do diário.

- Backend (Node.js/Express): Uma API RESTful simples para persistência dos dados do diário em um banco de dados PostgreSQL.


## 🗂️ Estrutura do Projeto
```
├── index.html 
├── css/
│   └── style.css
├── js/
│   └── app.js
├── backend/
│   ├── server.js
│   └── db.js
└── package.json
```

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:
- **Node.js** (v16 ou superior)
- **npm** (v8 ou superior)
- **PostgresSQL** (ou outro banco compatível, se desejar usar externo)

---

## 📝 Observações

- Certifique-se de que o **servidor Node.js** esteja rodando antes de acessar o painel no navegador.  
- Caso o **banco de dados local** ainda não exista, ele será criado automaticamente ao iniciar o backend (ou pode ser criado manualmente com o script SQL fornecido).  
- O mapa interativo pode demorar alguns segundos para carregar as informações, dependendo da conexão com a **Open-Meteo API**.  

---

## 🧩 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seuusuario/Projeto-Painel-Meteorologico-OpenMeteo.git
   ```
2. **Acesse a pasta do projeto:**
   ```bash
   cd Projeto
   ```
3. **Instale as dependências:**
   ```bash
   npm install
   ```

## ▶️ Como Rodar o Projeto

1. **Abra o terminal e navegue até o diretório do backend:**
   ```bash
   cd backend
   ```
2. **Inicie o servidor Node.js onde se encontra o arquivo "server.js":
   ```bash
   node server.js
   ```
3. **Abra seu navegador e acesse:**
   ```yaml
   http://localhost:3000
   ```

4. **O backend rodará localmente e se conectará ao banco de dados integrado.
Caso prefira, você pode criar manualmente seu banco seguindo o script SQL abaixo**

## 🔧 Script SQL de Criação:
```sql
CREATE TABLE diario_meteorologico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    tags TEXT,
    observacoes TEXT,
    condicoes_percebidas TEXT,
    photo_url TEXT
);
```
## 💾 Exemplo de Dados Inseridos:
```sql
INSERT INTO diario_meteorologico (id, date, tags, observacoes, condicoes_percebidas, photo_url) VALUES
(11, '2025-11-12T03:00:00.000Z', 'Chuvas e ventos', 'Dia calorento, porém com chuva', 'Chuvoso', ''),
(10, '2025-11-20T03:00:00.000Z', 'Calor', 'Dia normal', 'Nublado', NULL);
```

## 📦 Exemplo de Estrutura JSON:

- O arquivo package.json ou resposta JSON local pode conter dados no formato:
  ```json
  [
  {
    "id": 11,
    "date": "2025-11-12T03:00:00.000Z",
    "tags": "Chuvas e ventos",
    "observacoes": "Dia calorento, porem com chuva",
    "condicoes_percebidas": "Chuvoso",
    "photo_url": ""
  },
  {
    "id": 10,
    "date": "2025-11-20T03:00:00.000Z",
    "tags": "Calor",
    "observacoes": "Dia normal",
    "condicoes_percebidas": "Nublado",
    "photo_url": null
   }
  ]
  ```

---

## ☁️ Créditos

Este projeto utiliza dados meteorológicos fornecidos pela **[Open-Meteo API](https://open-meteo.com/)**, uma plataforma gratuita e de código aberto.

---

## 📜 Licença
Este projeto está sob a licença MIT - sinta-se à vontade para utilizá-lo e modificá-lo!

👨‍💻 Desenvolvido com por [Caio Sando](https://github.com/Caiojosue)

