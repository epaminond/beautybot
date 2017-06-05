module.exports = bp => {
  bp.hear(/\bhello\b|\bhi\b|\bhey\b/i, (event, next) => {
    bp.messenger.sendText(event.user.id, 'Hi! I\'m a Beauty Salon Bot! Is there anything I could help you with?')
  })

  bp.hear(/\bbye\b/i, (event, next) => {
    bp.messenger.sendText(event.user.id, 'See you! :)')
  })
}
