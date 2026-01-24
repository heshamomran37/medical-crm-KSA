const { Client } = require('pg');

const connectionString = "postgresql://postgres.ifvcmhnbhwyvidjqbuwm:Piko_9080%40123@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

async function deploySchema() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('⏳ Connecting to Supabase...');
        await client.connect();
        console.log('✅ Connected.');

        const sql = `
    -- CreateTable
    CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'ADMIN',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "Employee" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'Active',
        "email" TEXT,
        "phone" TEXT,
        "whatsapp" TEXT,
        "address" TEXT,
        "department" TEXT,
        "telegram" TEXT,
        "instagram" TEXT,
        "snapchat" TEXT,
        "username" TEXT,
        "password" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "Patient" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'Individual',
        "email" TEXT,
        "phone" TEXT,
        "whatsapp" TEXT,
        "telegram" TEXT,
        "instagram" TEXT,
        "snapchat" TEXT,
        "facebook" TEXT,
        "tiktok" TEXT,
        "address" TEXT,
        "status" TEXT NOT NULL DEFAULT 'New',
        "followUpStatus" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "birthDate" TIMESTAMP(3),
        "gender" TEXT,
        "createdById" TEXT,
        CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "ActivityLog" (
        "id" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "userId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "WhatsAppMessage" (
        "id" TEXT NOT NULL,
        "patientId" TEXT,
        "senderPhone" TEXT NOT NULL,
        "senderName" TEXT,
        "messageText" TEXT NOT NULL,
        "messageType" TEXT NOT NULL DEFAULT 'text',
        "direction" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'received',
        "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "WhatsAppSession" (
        "id" TEXT NOT NULL,
        "isConnected" BOOLEAN NOT NULL DEFAULT false,
        "qrCode" TEXT,
        "lastConnected" TIMESTAMP(3),
        "phoneNumber" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WhatsAppSession_pkey" PRIMARY KEY ("id")
    );

    -- Indices
    CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
    CREATE UNIQUE INDEX IF NOT EXISTS "Employee_username_key" ON "Employee"("username");
    CREATE INDEX IF NOT EXISTS "Employee_name_idx" ON "Employee"("name");
    CREATE INDEX IF NOT EXISTS "Employee_phone_idx" ON "Employee"("phone");
    CREATE INDEX IF NOT EXISTS "Employee_status_idx" ON "Employee"("status");
    CREATE INDEX IF NOT EXISTS "Patient_name_idx" ON "Patient"("name");
    CREATE INDEX IF NOT EXISTS "Patient_phone_idx" ON "Patient"("phone");
    CREATE INDEX IF NOT EXISTS "Patient_status_idx" ON "Patient"("status");
    CREATE INDEX IF NOT EXISTS "Patient_createdById_idx" ON "Patient"("createdById");
    CREATE INDEX IF NOT EXISTS "ActivityLog_userId_idx" ON "ActivityLog"("userId");
    CREATE INDEX IF NOT EXISTS "WhatsAppMessage_patientId_idx" ON "WhatsAppMessage"("patientId");
    CREATE INDEX IF NOT EXISTS "WhatsAppMessage_senderPhone_idx" ON "WhatsAppMessage"("senderPhone");
    CREATE INDEX IF NOT EXISTS "WhatsAppMessage_timestamp_idx" ON "WhatsAppMessage"("timestamp");
    
    -- Relations
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WhatsAppMessage_patientId_fkey') THEN
            ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
    END
    $$;
    `;

        console.log('🚀 Running migration SQL...');
        await client.query(sql);
        console.log('✅ Schema deployed successfully!');

        await client.end();
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    }
}

deploySchema();
