require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query("INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true) ON CONFLICT DO NOTHING;");
    console.log('Bucket created via SQL');
    
    // Also we need to add a policy for everyone to insert and select from attachments bucket!
    // Since this is a simple OMS and objects are random strings, we'll allow all operations on this bucket.
    await client.query(`
      CREATE POLICY "Allow public access to attachments"
      ON storage.objects FOR ALL
      USING (bucket_id = 'attachments')
      WITH CHECK (bucket_id = 'attachments');
    `);
    console.log('Policy created via SQL');
  } catch (err) {
    if (err.code === '42710') {
        console.log('Policy already exists, ignoring.');
    } else {
        console.error(err);
    }
  } finally {
    await client.end();
  }
}

main();
