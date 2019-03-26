const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  // const Database = use('Database')
  // Database.on('query', function(q){console.log(q.sql)})
  
  const View = use('View')
  View.global('h1', function (s) {
    return '<h1>' + s + '</h1>'
  })
  
  const Response = use('Adonis/Src/Response')
  Response.macro('sendStatus', function (status, content) {
    this.status(status).send(content)
  })
})