const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  // Use connectionString for easy deployment (Supabase/Render)
});

module.exports = pool;