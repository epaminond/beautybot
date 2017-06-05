const { services } = require('../fixtures')

module.exports = bp => {
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
}
