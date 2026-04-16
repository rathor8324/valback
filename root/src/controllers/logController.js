const logService = require('../services/logService');

class LogController {
  /**
   * Handle POST /api/logs
   * Create a new log entry
   */
  async createLog(req, res, next) {
    try {
      // If the frontend forgets `Content-Type: application/json`, `req.body` may be undefined.
      const body = req.body || {};
      const { name, action, ip } = body;
      console.log('[POST /api/logs] body:', body);
      

      // Get IP from request if not provided in body (fallback to client IP)
      const ipAddress = ip || req.ip || req.connection.remoteAddress;
      console.log('[POST /api/logs] ipAddress:', ipAddress);

      if (!name || !action) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields: name and action' }
        });
      }

      const timeoutMs = Number(process.env.LOG_CREATE_TIMEOUT_MS || 8000);
      const withTimeout = (promise, ms) =>
        Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`DB timeout after ${ms}ms`)), ms)
          )
        ]);

      const log = await withTimeout(
        logService.createLog(name, action, ipAddress),
        timeoutMs
      );

      res.status(201).json({
        success: true,
        data: log
      });
    } catch (error) {
      console.error('[POST /api/logs] error:', error);
      next(error);
    }
  }

  /**
   * Handle GET /api/logs
   * Get all logs ordered by newest first
   */
  async getAllLogs(req, res, next) {
    try {
      const logs = await logService.getAllLogs();

      res.status(200).json({
        success: true,
        data: logs,
        count: logs.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LogController();
