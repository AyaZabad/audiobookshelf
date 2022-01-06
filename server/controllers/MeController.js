const Logger = require('../Logger')
const { isObject } = require('../utils/index')

class MeController {
  constructor() { }

  // GET: api/me/listening-sessions
  async getListeningSessions(req, res) {
    var listeningSessions = await this.getUserListeningSessionsHelper(req.user.id)
    res.json(listeningSessions.slice(0, 10))
  }

  // GET: api/me/listening-stats
  async getListeningStats(req, res) {
    var listeningStats = await this.getUserListeningStatsHelpers(req.user.id)
    res.json(listeningStats)
  }

  // PATCH: api/me/audiobook/:id/reset-progress
  async resetAudiobookProgress(req, res) {
    var audiobook = this.db.audiobooks.find(ab => ab.id === req.params.id)
    if (!audiobook) {
      return res.status(404).send('Audiobook not found')
    }
    req.user.resetAudiobookProgress(audiobook)
    await this.db.updateEntity('user', req.user)

    var userAudiobookData = req.user.audiobooks[audiobook.id]
    if (userAudiobookData) {
      this.clientEmitter(req.user.id, 'current_user_audiobook_update', { id: audiobook.id, data: userAudiobookData })
    }

    this.clientEmitter(req.user.id, 'user_updated', req.user.toJSONForBrowser())
    res.sendStatus(200)
  }

  // PATCH: api/me/audiobook/:id
  async updateAudiobookData(req, res) {
    var audiobook = this.db.audiobooks.find(ab => ab.id === req.params.id)
    if (!audiobook) {
      return res.status(404).send('Audiobook not found')
    }
    var wasUpdated = req.user.updateAudiobookData(audiobook.id, req.body)
    if (wasUpdated) {
      await this.db.updateEntity('user', req.user)
      this.clientEmitter(req.user.id, 'user_updated', req.user.toJSONForBrowser())
    }
    res.sendStatus(200)
  }

  // PATCH: api/me/audiobook/batch/update
  async batchUpdateAudiobookData(req, res) {
    var userAbDataPayloads = req.body
    if (!userAbDataPayloads || !userAbDataPayloads.length) {
      return res.sendStatus(500)
    }

    var shouldUpdate = false
    userAbDataPayloads.forEach((userAbData) => {
      var audiobook = this.db.audiobooks.find(ab => ab.id === userAbData.audiobookId)
      if (audiobook) {
        var wasUpdated = req.user.updateAudiobookData(audiobook.id, userAbData)
        if (wasUpdated) shouldUpdate = true
      }
    })

    if (shouldUpdate) {
      await this.db.updateEntity('user', req.user)
      this.clientEmitter(req.user.id, 'user_updated', req.user.toJSONForBrowser())
    }

    res.sendStatus(200)
  }

  // PATCH: api/me/password
  updatePassword(req, res) {
    this.auth.userChangePassword(req, res)
  }

  // PATCH: api/me/settings
  async updateSettings(req, res) {
    var settingsUpdate = req.body
    if (!settingsUpdate || !isObject(settingsUpdate)) {
      return res.sendStatus(500)
    }
    var madeUpdates = req.user.updateSettings(settingsUpdate)
    if (madeUpdates) {
      await this.db.updateEntity('user', req.user)
    }
    return res.json({
      success: true,
      settings: req.user.settings
    })
  }
}
module.exports = new MeController()