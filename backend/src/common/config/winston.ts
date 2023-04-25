import winston from 'winston';

// define the custom settings for each transport (file, console)
const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false, // do not exit on handled exceptions
});

export const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export default logger;
