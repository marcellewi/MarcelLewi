const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      filename: `${__dirname}/logs/acessLogs.log`,
    }),
    new transports.Console({
      level: 'debug',
      colorize: true,
    }),
  ],
});
