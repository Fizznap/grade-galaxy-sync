const fs = require('fs');
const path = require('path');

const typesPath = path.join(__dirname, '../src/integrations/supabase/types.ts');
let content = fs.readFileSync(typesPath, 'utf8');

const rpcDef = `
      import_domain_data: {
        Args: {
          p_category: string
          p_import_hash: string
          p_filename: string
          p_records: Json
        }
        Returns: Json
      }
`;

if (!content.includes('import_domain_data')) {
  content = content.replace(
    '      is_staff: { Args: { _user_id: string }; Returns: boolean }',
    '      is_staff: { Args: { _user_id: string }; Returns: boolean }' + rpcDef
  );
  fs.writeFileSync(typesPath, content);
  console.log('RPC added');
} else {
  console.log('RPC already added');
}
