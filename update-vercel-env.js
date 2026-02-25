const { execSync } = require('child_process');

const dbUrl = "postgresql://postgres.ifvcmhnbhwyvidjqbuwm:Piko_9080%40123@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=no-verify&pgbouncer=true";

try {
    console.log("Removing old DATABASE_URL...");
    try { execSync('npx vercel env rm DATABASE_URL production -y', { stdio: 'inherit' }); } catch (e) { }
    try { execSync('npx vercel env rm DATABASE_URL preview -y', { stdio: 'inherit' }); } catch (e) { }
    try { execSync('npx vercel env rm DATABASE_URL development -y', { stdio: 'inherit' }); } catch (e) { }

    console.log("Adding new DATABASE_URL...");
    execSync('npx vercel env add DATABASE_URL production', { input: dbUrl, stdio: ['pipe', 'inherit', 'inherit'] });

    console.log("Adding new AUTH_SECRET...");
    try { execSync('npx vercel env rm AUTH_SECRET production -y', { stdio: 'inherit' }); } catch (e) { }
    execSync('npx vercel env add AUTH_SECRET production', { input: "secret_key_123", stdio: ['pipe', 'inherit', 'inherit'] });

    console.log("Environment variables updated successfully.");
} catch (error) {
    console.error("Script failed:", error.message);
}
