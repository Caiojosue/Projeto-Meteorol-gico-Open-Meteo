import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco_de_dados', 
  password: 'sua_senha',
  port: 5432,
});

export default pool;
