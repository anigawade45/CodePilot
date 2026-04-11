const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class StorageService {
  async uploadFile(filePath, fileName, mimeType) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      
      const { data, error } = await supabase.storage
        .from('source-clusters')
        .upload(`uploads/${Date.now()}-${fileName}`, fileBuffer, {
          contentType: mimeType,
          upsert: false
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase Storage Error:', error);
      throw new Error(`Cloud Storage Failure: ${error.message}`);
    } finally {
      // Cleanup local temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  async getFileUrl(path) {
    const { data } = supabase.storage
      .from('source-clusters')
      .getPublicUrl(path);
    return data.publicUrl;
  }
}

module.exports = new StorageService();
