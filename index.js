module.exports = function(bp) {
  bp.middlewares.load()

  // Listens for a message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|hey/i, (event, next) => {
    bp.messenger.sendText(event.user.id, 'welcome!!')
  })
}
