const { MyBot } = require('koreanbots')

const Extension = require('../../src/structures/Extension')

class KoreanbotsExtension extends Extension {
  constructor(client) {
    super(client, {
      name: 'koreanbots',
      description: 'Extension for Koreanbots'
    })
  }

  init () {
    const config = {}
    config.token = this._config.token || ''
    config.updateGuildCount = this._config.updateGuildCount == null || this._config.updateGuildCount === true
    config.updateGuildCountInterval = this._config.updateGuildCountInterval || 60000 * 10

    this._config = config

    if (typeof config.token !== 'string' || config.token.length < 1) return this._logger.error('Invalid token provided. Extension stopped.')

    this.bot = new MyBot(config.token, {
      hideToken: true
    })

    if (config.updateGuildCount) {
      // this.recentGuildCount = 0
      this.updateGuildCount()
      this.intervalID = setInterval(this.updateGuildCount.bind(this), config.updateGuildCountInterval)
    } else {
      this._logger.log('disabled automatic guild count updating')
    }
  }

  destroy() {
    clearInterval(this.intervalID)
  }

  updateGuildCount() {
    const guildCount = this._client.guilds.cache.size
    // if(guildCount === this.recentGuildCount) return this._logger.debug('Guild Count same as before: ' + guildCount + ', Skipping.')

    this.bot.update(guildCount)
      .then((res) => {
        this._logger.log('Guild Count updated: ' + guildCount)
        this._logger.debug('Returned information:\n' + JSON.stringify(res, null, 2))
        this.recentGuildCount = guildCount
      })
      .catch((err) => this._logger.error(err))
  }
}

module.exports = KoreanbotsExtension
