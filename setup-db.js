#!/usr/bin/env node

/**
 * Script de inicialização do banco de dados SETI 2026
 * 
 * Uso:
 *   node setup-db.js
 * 
 * Este script:
 * 1. Cria as tabelas do banco de dados
 * 2. Popula com dados iniciais
 * 3. Cria um usuário admin padrão
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'seti_2026'
};

async function main() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });

    console.log('✅ Conectado ao MySQL');

    // Criar banco de dados
    console.log(`📦 Criando banco de dados "${config.database}"...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    console.log('✅ Banco de dados criado/verificado');

    // Selecionar banco
    await connection.execute(`USE ${config.database}`);

    // Ler e executar schema
    console.log('📋 Criando tabelas...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir por `;` e executar cada statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await connection.execute(stmt);
      }
    }
    console.log('✅ Tabelas criadas/verificadas');

    // Ler e executar seed
    console.log('🌱 Populando dados iniciais...');
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    
    const seedStatements = seed.split(';').filter(stmt => stmt.trim());
    for (const stmt of seedStatements) {
      if (stmt.trim()) {
        try {
          await connection.execute(stmt);
        } catch (error) {
          // Ignorar erros de duplicação (chave única)
          if (!error.message.includes('Duplicate entry')) {
            throw error;
          }
        }
      }
    }
    console.log('✅ Dados iniciais carregados');

    // Criar usuário admin padrão
    console.log('👤 Criando usuário admin padrão...');
    const adminEmail = 'admin@seti2026.local';
    const adminPassword = 'admin123';
    const adminHash = await bcrypt.hash(adminPassword, 10);

    try {
      await connection.execute(
        'INSERT INTO users (nome, email, password_hash, role, ativo) VALUES (?, ?, ?, ?, ?)',
        ['Administrador', adminEmail, adminHash, 'admin', true]
      );
      console.log('✅ Usuário admin criado');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Senha: ${adminPassword}`);
      console.log('   ⚠️  Altere a senha após o primeiro login!');
    } catch (error) {
      if (error.message.includes('Duplicate entry')) {
        console.log('ℹ️  Usuário admin já existe');
      } else {
        throw error;
      }
    }

    console.log('\n✨ Setup concluído com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente em .env');
    console.log('2. Execute: npm install');
    console.log('3. Execute: npm start');
    console.log('4. Acesse: http://localhost:3000/admin');
    console.log(`5. Login com: ${adminEmail} / ${adminPassword}`);

  } catch (error) {
    console.error('❌ Erro durante setup:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
