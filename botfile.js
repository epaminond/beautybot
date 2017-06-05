const fs = require('fs')

const defaultPostgresSettings = {
  enabled: true,
  connection: process.env.PG_URL || process.env.DATABASE_URL || null
}

const postgres = fs.existsSync('./postgres.json') ? require('./postgres') : defaultPostgresSettings

module.exports = {

  /**
  * where the content is stored
  * you can access this property from `bp.dataLocation`
  */
  dataDir: process.env.BOTPRESS_DATA_DIR || './data',

  modulesConfigDir: process.env.BOTPRESS_CONFIG_DIR || './modules_config',
  disableFileLogs: false,
  port: process.env.BOTPRESS_PORT || process.env.PORT || 3000,
  optOutStats: false,
  notification: {
    file: 'notifications.json',
    maxLength: 50
  },
  log: {
    file: 'bot.log',
    maxSize: 1e6 // 1mb
  },

  /**
  * Access control of admin panel
  */
  login: {
    enabled: process.env.NODE_ENV === 'production',
    tokenExpiry: '6 hours',
    password: process.env.BOTPRESS_PASSWORD || 'password',
    maxAttempts: 3,
    resetAfter: 10 * 60 * 1000 // 10 minutes
  },

  /**
  * Postgres configuration
  */
  postgres,

  /**
  * License configuration
  * By default, your bot is licensed under Botpress Proprietary License, you can change it for 'AGPL-3.0'
  * in your 'package.json' if you want to create an open-source chatbot. Otherwise, depending on the edition
  * you are using, you need to respect some criterias.
  * Please visit: https://botpress.io/license or contact us at contact@botpress.io
  */
  license: {
    // -> Update this if you bought a Botpress license <-
    // customerId: process.env.BOTPRESS_CUSTOMER_ID || '',
    // licenseKey: process.env.BOTPRESS_LICENSE_KEY || ''
  }
}
