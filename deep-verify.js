const { Client } = require('pg');

const connectionString = "postgresql://postgres.ifvcmhnbhwyvidjqbuwm:Piko_9080%40123@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

async function deepVerify() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const tables = ['Sale', 'Expense'];

        for (const table of tables) {
            console.log(`\n--- Schema for table: ${table} ---`);
            const res = await client.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = '${table}'
                ORDER BY ordinal_position;
            `);

            res.rows.forEach(row => {
                console.log(`- ${row.column_name.padEnd(15)} | ${row.data_type.padEnd(15)} | Nullable: ${row.is_nullable}`);
            });
        }

        await client.end();
    } catch (err) {
        console.error('❌ Deep verification failed:', err.message);
    }
}

deepVerify();
