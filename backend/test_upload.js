require('dotenv').config();
const supabase = require('./src/config/db');

async function main() {
  const { data, error } = await supabase.storage
    .from('attachments')
    .upload('test.txt', Buffer.from('hello'), {
      contentType: 'text/plain',
      upsert: false,
    });
    
  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload success:', data);
  }
}

main();
