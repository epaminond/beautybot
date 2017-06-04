const { services, portfolio } = require('./fixtures')

module.exports = function(bp) {
  bp.middlewares.load()

  // Hello-goodbye
  bp.hear(/\bhello\b|\bhi\b|\bhey\b/i, (event, next) => {
    bp.messenger.sendText(event.user.id, 'Hi! I\'m a Beauty Salon Bot! Is there anything I could help you with?')
  })

  bp.hear(/\bbye\b/i, (event, next) => {
    bp.messenger.sendText(event.user.id, 'See you! :)')
  })

  // Inquiries on services
  bp.hear(/.*services.*/i, (event, next) => {
    const serviceNames = Object.values(services).map(service => service.name)
    bp.messenger.sendText(event.user.id, `Here's a list of our services: ${serviceNames.join(', ')}.`)
  })

  Object.values(services).map(service => {
    const match = new RegExp(`about ${service.name}|price of ${service.name}|${service.name} price`, 'i')
    bp.hear(match, (event, next) => {
      bp.messenger.sendText(event.user.id, `We are doing ${service.name} pretty good.
                                            ${service.description}.
                                            The price is $${service.price}.`)
    })
  })

  bp.hear(/.*services.*/i, (event, next) => {
    const serviceNames = Object.values(services).map(service => service.name)
    bp.messenger.sendText(event.user.id, `Here's a list of our services: ${serviceNames.join(', ')}.`)
  })

  // Showcase
  bp.hear(/.*showcase.*|.*examples.*|.*portfolio.*/i, (event, next) => {
    bp.messenger.sendText(event.user.id, `Check some of our works below`)
    bp.messenger.sendTemplate(event.user.id, { template_type: 'generic', elements: portfolio })
  })

  // Answer unhandled messages
  bp.hear(/.+/, (event, next) => {
    if(event.type !== 'message') { return }
    bp.messenger.sendText(event.user.id, 'Sorry, I didn\'t quite get you.')
  })
}
