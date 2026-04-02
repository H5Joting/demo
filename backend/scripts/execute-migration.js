import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile() {
  const sqlFilePath = join(__dirname, 'supabase/migrations/008_add_complete_mock_data.sql');
  const sqlContent = readFileSync(sqlFilePath, 'utf-8');
  
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.log(`Statement ${i + 1} error: ${error.message}`);
        errorCount++;
      } else {
        successCount++;
        if ((i + 1) % 10 === 0) {
          console.log(`Progress: ${i + 1}/${statements.length}`);
        }
      }
    } catch (err) {
      console.log(`Statement ${i + 1} exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\nCompleted: ${successCount} success, ${errorCount} errors`);
}

executeSqlFile().catch(console.error);
