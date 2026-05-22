const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
            let log = `${timestamp} [${level}]: ${message}`;
            if (stack) log += `\n${stack}`;
            if (Object.keys(meta).length > 0) log += ` ${JSON.stringify(meta)}`;
            return log;
          })
        )
  ),
  transports: [new winston.transports.Console()],
  defaultMeta: { service: 'aiscale-api' },
});

module.exports = logger;
