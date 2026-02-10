const logService = require('../services/logService');

class LogController {
  /**
   * Handle POST /api/logs
   * Create a new log entry
   */
  async createLog(req, res, next) {
    try {
      const { name, action, ip } = req.body;
      console.log("+++++++++++++++++++++++++++++================", req.body);
      

      // Get IP from request if not provided in body (fallback to client IP)
      const ipAddress = ip || req.ip || req.connection.remoteAddress;
      console.log("#@@@@@@@#########################", ipAddress);
      const log = await logService.createLog(name, action, ipAddress);
      console.log("#########################", log);
      res.status(201).json({
        success: true,
        data: log
      });
    } catch (error) {
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
