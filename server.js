'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

const { Ignitor } = require('@adonisjs/ignitor')


new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .then(async () => {
    //start
    const Database = use('Database')
    const CrawlerService = require("./app/Services/CrawlerService")

    const count = await Database
    .from('raw_contents')
    .count()    
    const total = count[0]['count(*)']
    if(total === 0){
      // to get all data
      await CrawlerService.get_data()
    }
    var schedule = require('node-schedule');

    var j = schedule.scheduleJob('*/5 * * * *', async function () {
      console.log('every 5 minute to get erji first page data');
      await CrawlerService.get_data_page(1, 1, [])
    });
  })
  .catch(console.error)

