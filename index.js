const services = require('./services')

module.exports = function(bp) {
  bp.middlewares.load()

  bp.hear(/\bhello\b|\bhi\b|\bhey\b/i, (event, next) => {
    bp.messenger.sendText(event.user.id, 'Hi! I\'m a Beauty Salon Bot! Is there anything I could help you with?')
  })

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
}
