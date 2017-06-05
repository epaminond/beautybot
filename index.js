const setupGreetings = require('./dialogues/greetings')
const setupServices = require('./dialogues/services')
const setupShowcase = require('./dialogues/showcase')
const setupScheduling = require('./dialogues/scheduling')

module.exports = function(bp) {
  bp.middlewares.load()

  setupGreetings(bp)
  setupServices(bp)
  setupShowcase(bp)
  setupScheduling(bp)

  // Answer unhandled messages
  // bp.hear(/.+/, (event, next) => {
  //   const convo = bp.convo.find(event)
  //   if(convo || event.type !== 'message') { return }
  //   bp.messenger.sendText(event.user.id, 'Sorry, I didn\'t quite get you.')
  // })
}
