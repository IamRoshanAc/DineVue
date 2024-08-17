const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./userModel'); // Import User model correctly

class AuditLog extends Model {}

AuditLog.init({
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  action_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  details: {
    type: DataTypes.JSONB
  },
  ip_address: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'AuditLog',
  tableName: 'audit_logs',
  timestamps: false
});

// Define associations
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = AuditLog;
