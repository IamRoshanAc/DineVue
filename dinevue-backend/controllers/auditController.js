const { AuditLog } = require('../model/auditModel'); // Adjust path as necessary
const { User } = require('../model/userModel'); // Adjust path as necessary

const getAuditLogs = async (req, res) => {
    try {
      if (!AuditLog) {
        console.error('AuditLog model is not defined');
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      const logs = await AuditLog.findAll({
        attributes: ['timestamp', 'user_id', 'action_type', 'ip_address', 'details'],
        include: [{ model: User, attributes: ['username', 'email'] }]
      });
  
      // Format data if needed
      const formattedLogs = logs.map(log => ({
        time: log.timestamp,
        username: log.User.email, // Adjust as per your User model
        url: log.action_type,
        method: log.action_type.split(' ')[0]
      }));
  
      res.status(200).json(formattedLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

module.exports = {
  getAuditLogs,
};
