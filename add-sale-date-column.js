const { Client } = require('pg');

const connectionString = "postgresql://postgres.ifvcmhnbhwyvidjqbuwm:Piko_9080%40123@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

async function addSaleDateColumn() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('⏳ Connecting to Supabase...');
        await client.connect();
        console.log('✅ Connected.');

        console.log('🚀 Checking if saleDate column exists in Sale table...');
        const checkResult = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='Sale' AND column_name='saleDate';
        `);

        if (checkResult.rows.length === 0) {
            console.log('➕ Adding saleDate column to Sale table...');
            await client.query('ALTER TABLE "Sale" ADD COLUMN "saleDate" TIMESTAMP(3);');
            console.log('✅ Column added successfully!');
        } else {
            console.log('ℹ️ Column saleDate already exists.');
        }

        await client.end();
    } catch (err) {
        console.error('❌ SQL execution failed:', err.message);
    }
}

addSaleDateColumn();
