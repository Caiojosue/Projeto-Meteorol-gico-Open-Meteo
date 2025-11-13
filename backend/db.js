import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: 'seu_usuario',
        host: 'localhost',
        database: 'seu_banco_de_dados',
        password: 'sua_senha',
        port: 5432,
      }
);

export default pool;
