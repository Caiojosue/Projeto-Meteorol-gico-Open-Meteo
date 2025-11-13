import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'weather_diary', 
  password: 'lydia',
  port: 5432,
});

export default pool;
