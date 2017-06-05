const { services } = require('../fixtures')

const dbUserId = event => `${event.platform}:${event.user.id}`
const stringifyEvents = events => {
  return events.map(event => `#${event.id}: ${event.starts_at} - ${event.service_name}`).join("\n")
}
const createTimeThread = (convo, txt) => {
  convo.createThread('time')
  const whatTime = 'What date and time would you like to schedule for?\
                    Type smth like 2017-06-20 13:00'
  convo.threads['time'].addQuestion(txt(whatTime), [
    {
      pattern: new RegExp('\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) '
                          + '(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])', 'i'),
      callback: (response) => {
        convo.set('time', new Date(response.text))
        convo.next()
      }
    },
    {
      default: true,
      callback: () => {
        convo.say(txt('Hrm.. I\'m expecting time to be in format 2017-06-20 13:00'))
        convo.repeat()
      }
    }
  ])
}

module.exports = bp => {
  bp.db.get().then(knex => {
    // Ensure we have table
    knex.schema.createTableIfNotExists('events', (table) => {
      table.increments()
      table.dateTime('starts_at')
      table.string('user_id').references('users.id')
      table.string('service_name')
    })
  })

  // User can exit current conversation
  bp.hear(/stop|abort/i, (event, next) => {
    const convo = bp.convo.find(event)
    convo && convo.stop('aborted')
  })

  // Schedule event
  bp.hear(/.*\bschedule.*/i, (event, next) => {
    const txt = txt => bp.messenger.createText(event.user.id, txt)
    const serviceNames = Object.values(services).map(service => service.name)

    bp.convo.start(event, convo => {
      convo.threads['default'].addMessage(txt('OK, let\'s schedule new event!'))
      convo.threads['default'].addQuestion(txt('Which service are you scheduling?'), [
        ...serviceNames.map(serviceName => ({
          pattern: new RegExp(`.*${serviceName}.*`, 'i'),
          callback: () => {
            convo.set('serviceName', serviceName)
            convo.say(txt(`OK, scheduling for ${serviceName}`))
            convo.switchTo('time')
          }
        })),
        {
          default: true,
          callback: () => {
            convo.say(txt(`Sorry I dont understand. ${serviceNames.join(', ')}?`))
            convo.repeat()
          }
        }
      ])

      createTimeThread(convo, txt)

      convo.on('done', () => {
        const service_name = convo.get('serviceName')
        const eventAttrs = { user_id: dbUserId(event), starts_at: convo.get('time'), service_name }
        bp.db.get()
          .then(knex => knex('events').insert(eventAttrs))
          .then(() => convo.say(txt(`So... we are waiting for you on ${convo.get('time')}. :)`)))
      })

      convo.on('aborted', () => { convo.say(txt('OK. Is there anything else I could help you with?')) })
    })
  })

  // Cancel event
  bp.hear(/.*cancel.*/i, (event, next) => {
    const txt = txt => bp.messenger.createText(event.user.id, txt)

    bp.convo.start(event, convo => {
      bp.db.get()
        .then(knex => knex('events').where('user_id', dbUserId(event)).where('starts_at', '>=', new Date()))
        .then((events) => {
          convo.say(txt(stringifyEvents(events)))
          convo.threads['default'].addQuestion(txt('Which of these would you like to cancel? Type it\'s id.'), [
            {
              pattern: /(\d+)/i,
              callback: (response) => {
                convo.set('eventId', response.text)
                convo.say(txt(`OK, removing event #${response.text}`))
                convo.next()
              }
            },
            {
              default: true,
              callback: () => {
                convo.say(txt(`Id is a number.`))
                convo.repeat()
              }
            }
          ])
        })

      convo.on('done', () => {
        bp.db.get()
          .then(knex => knex('events').where('user_id', dbUserId(event)).where('id', convo.get('eventId')).del())
          .then(() => convo.say(txt(`No such event any more!`)))
      })

      convo.on('aborted', () => { convo.say(txt('OK. Is there anything else I could help you with?')) })
    })
  })

  // Reschedule event
  bp.hear(/.*reschedule.*/i, (event, next) => {
    const txt = txt => bp.messenger.createText(event.user.id, txt)

    bp.convo.start(event, convo => {
      bp.db.get()
        .then(knex => knex('events').where('user_id', dbUserId(event)).where('starts_at', '>=', new Date()))
        .then((events) => {
          convo.say(txt(stringifyEvents(events)))
          convo.threads['default'].addQuestion(txt('Which of these would you like to reschedule? Type it\'s id.'), [
            {
              pattern: /(\d+)/i,
              callback: (response) => {
                convo.set('eventId', response.text)
                convo.say(txt(`OK, rescheduling event #${response.text}`))
                convo.switchTo('time')
              }
            },
            {
              default: true,
              callback: () => {
                convo.say(txt(`Id is a number.`))
                convo.repeat()
              }
            }
          ])
        })

      createTimeThread(convo, txt)

      convo.on('done', () => {
        bp.db.get()
          .then(knex => knex('events').where('user_id', dbUserId(event))
                                      .where('id', convo.get('eventId'))
                                      .update({ starts_at: convo.get('time') }))
          .then(() => convo.say(txt(`Done! Waiting for you on ${convo.get('time')}`)))
      })

      convo.on('aborted', () => { convo.say(txt('OK. Is there anything else I could help you with?')) })
    })
  })
}
