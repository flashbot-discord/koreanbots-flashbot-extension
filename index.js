const dbkr = require('dbkr')
const Extension = require('../../classes/Extension')

class DBKRExtension extends Extension {
  constructor(client) {
    super(client, {
      name: 'dbkr',
      description: 'Extension for DBKR'
    })

    this.recentGuildCount = 0
    this.saveGuildCount()
  }

  saveGuildCount() {
    setInterval(() => {
      const guildCount = this._client.guilds.cache.size
      if(guildCount === this.recentGuildCount) return this._logger.debug('Guild Count same as before: ' + guildCount + ', Skipping.')

      if(typeof this._config.token !== 'string' || this._config.token.length < 1) return this._logger.error('Invalid token provided.')
      dbkr(this._client, this._config.token || '')
        .then(() => {
          this._logger.log('Guild Count updated: ' + guildCount)
          this.recentGuildCount = guildCount
        })
        .catch((err) => this._logger.error(err))
    }, this._config.saveInterval || 10000)
  }
}

module.exports = DBKRExtension
