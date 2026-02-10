const db = require('../config/db');

class LogService {
  /**
   * Create a new log entry
   * @param {string} name - User name
   * @param {string} action - Action performed
   * @param {string} ipAddress - IP address (IPv4 or IPv6)
   * @returns {Promise<Object>} Created log entry
   */
  async createLog(name, action, ipAddress) {
    try {
      // Use INET6_ATON() to convert IP address to binary
      const [insertResult] = await db.raw(
        `INSERT INTO user_logs (name, action, ip_address, created_at) 
         VALUES (?, ?, INET6_ATON(?), NOW())`,
        [name, action, ipAddress]
      );

      const [selectRows] = await db.raw(
        `SELECT id, name, action, INET6_NTOA(ip_address) as ip_address, created_at 
         FROM user_logs 
         WHERE id = ?`,
        [insertResult.insertId]
      );

      return selectRows[0];
    } catch (error) {
      throw new Error(`Failed to create log: ${error.message}`);
    }
  }

  /**
   * Get all logs ordered by newest first
   * @returns {Promise<Array>} Array of log entries
   */
  async getAllLogs() {
    try {
      const rows = await db.raw(
        `SELECT id, name, action, INET6_NTOA(ip_address) as ip_address, created_at 
         FROM user_logs 
         ORDER BY created_at DESC`
      );

      return rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch logs: ${error.message}`);
    }
  }
}

module.exports = new LogService();
