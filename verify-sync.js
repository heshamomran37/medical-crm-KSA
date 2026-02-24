const { Client } = require('pg');

const connectionString = "postgresql://postgres.ifvcmhnbhwyvidjqbuwm:Piko_9080%40123@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

async function verifyTables() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('Sale', 'Expense');
        `);

        console.log('--- Table Check ---');
        res.rows.forEach(row => console.log(`✅ Found table: ${row.table_name}`));

        if (res.rows.length === 2) {
            console.log('\n✨ All tables verified successfully!');
        } else {
            console.warn(`\n⚠️ Missing tables! Found only: ${res.rows.map(r => r.table_name).join(', ')}`);
        }

        await client.end();
    } catch (err) {
        console.error('❌ Verification failed:', err.message);
    }
}

verifyTables();
