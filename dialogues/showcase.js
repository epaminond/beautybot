const { portfolio } = require('../fixtures')

module.exports = bp => {
  bp.hear(/.*showcase.*|.*examples.*|.*portfolio.*/i, (event, next) => {
    bp.messenger.sendText(event.user.id, `Check some of our works below`)
    bp.messenger.sendTemplate(event.user.id, { template_type: 'generic', elements: portfolio })
  })
}
