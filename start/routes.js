'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.get('/home', 'HomeController.index')
Route.post('/crawler/get_data', 'CrawlerController.get_data')
Route.get('/crawler/analyze_data', 'CrawlerController.analyze_data')
Route.get('/crawler/classify_and_choose_target_and_save', 'CrawlerController.classify_and_choose_target_and_save')
Route.get('/crawler/product_trend', 'CrawlerController.product_trend')

Route.post('/stock/buy', 'StockController.buy')
Route.post('/stock/sell', 'StockController.sell')
Route.post('/stock/recover_data', 'StockController.recover_data')