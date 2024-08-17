const AuditLog = require('../model/auditModel'); // Adjust path to your model

const logAction = async (req, res, next) => {
    const { method, originalUrl, body, ip } = req;
    const actionType = `${method} ${originalUrl}`;
    
    // Set user_id to null if user is not authenticated
    const userId = req.user ? req.user.id : null;
  
    const details = {
      body,
      query: req.query
    };
  
    try {
      await AuditLog.create({
        user_id: userId,
        action_type: actionType,
        details,
        ip_address: ip
      });
      next();
    } catch (error) {
      console.error('Error logging action:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

  

module.exports = logAction;
