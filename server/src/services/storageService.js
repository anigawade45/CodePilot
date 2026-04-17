const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class StorageService {
  async uploadFile(filePath, fileName, mimeType = 'text/plain') {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error("Source fragment not found in local buffer.");
      }

      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error("Cannot ingest empty data cluster.");
      }

      const fileBuffer = fs.readFileSync(filePath);

      const { data, error } = await supabase.storage
        .from('source-clusters')
        .upload(`uploads/${Date.now()}-${fileName}`, fileBuffer, {
          contentType: mimeType,
          upsert: false
        });

      if (error) {
        console.error(`❌ [Storage Rupture] ${error.message}`);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('🛰️ [Storage Fault] Infrastructure connection failed:', error.message);
      throw error;
    } finally {
      // 🛡️ FAULT-TOLERANT CLEANUP: Purge local fingerprint regardless of result
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupErr) {
        console.warn("⚠️ Cleanup warning (Non-fatal):", cleanupErr.message);
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
