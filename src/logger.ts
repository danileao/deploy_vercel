import winston from 'winston'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'app1.log',
    }),
    new winston.transports.File({
      filename: 'error1.log',
      level: 'error',
    }),
  ],
})

export { logger }
