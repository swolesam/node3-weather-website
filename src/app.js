const path = require('path') ;
const chalk = require('chalk') ;

const express = require('express') ;
const app = express() ;

// assign variable port to the ENVIRONMENT VAR "PORT" (thats how Heroku provides it) OR fall back on port 3000 instead.
const port = process.env.PORT || 3000 ;

const hbs = require('hbs') ;
 
const geocode = require('./utils/geocode') ;
const forecast = require('./utils/forecast') ;


// configure Express's "view engine" (exact text and case) to => hbs (handlebars module plugin for expressJs)
// by default it expects "views" directory at the root of the app
app.set('view engine', 'hbs') ;

// # these 2 values coming from the implicit function wrapper nodeJs adds parms 
//console.log('__dirname' , ' : ' , __dirname) ;
//console.log('__filename' , ' : ' , __filename) ;
// # now use the path lib
const publicDirPath = path.join(__dirname, '../', 'public') ;
console.log('Public dir Path ' , ' : ' , publicDirPath) ;

// to override the default expressJs behavior of looking for views inside a "views" directory:
const viewsPath = path.join(__dirname, '../templates/views') ;
// 'views' pre-defined, use as-is case-sensitive
app.set('views' , viewsPath) ;

//  $$ configure the express static content location - set it to 'public' dir path
// when browser requests come in, express will go to that directory and browse for the path requested in url
app.use(express.static(publicDirPath)) ;

const partialsPath = path.join(__dirname, '../templates/partials') ;
hbs.registerPartials(partialsPath) ;

app.get('', (req , res) => { 
    // render method allows you to render a view (no need for file extension), and pass in an 
    // object to inject the obj's fields in the View
    res.render('index', {
        name: 'Samuel E' ,
        title: 'Weather App' 
    }) ;
}) ;
/**
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * IMPORTANT: It matters what path on the command line you run the node/nodemon from. Always run from root directory:
 * Example:
 C:\Users\sam.el-nasr\RSA\courses\CompleteNodeJsDeveloperCourse3rdEd\code\web-server> nodemon src\app.js
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */

// /about
app.get('/about' , (req, res) => {
    res.render('about', {
        name: 'Samuel E' ,
        title: 'About Page' ,
        imgUrl: '/img/travel-1.jpg'
    }) ;
})

// /help
app.get('/help', (req, res) => {
    const dataObj = {
        title: 'Help Page' ,
        name: 'Samuel E' ,
        age: 22 ,
        gender: 'M'
    }
    
    res.render('help', dataObj) ;
})

/**  Setup the paths & path mappings  **/
/**  / (root)
app.get('', (req , res) => {
    console.log('Request received at root ... ') ;
    res.send('<b>Hello Express (world) !</b>') ;
}) ;
**/

/** /help
app.get('/help', (req, res) => {
    console.log('accessing /help') ;

    const dataObj = {
        name: 'Samuel E' ,
        age: 22 ,
        gender: 'M'
    }
    //res.send('Help Page') ;
    res.send(dataObj) ;
})
// /about
app.get('/about' , (req, res) => {
    console.log('/about page') ;
    res.send('<b>About Page</b>') ;
})
**/

// /weather
// will accept an address as query string and return back forecast for that address
app.get('/weather' , (req, res) => {
    console.log('/weather page') ;

    // check address querystring & if its null then set the response.send and return back (discontinue processing)
    if(!req.query.address) {
        return res.send({
            error: 'Please enter an address to get the Weather Forecast for!' 
        })
    }

    /**
     * Structure of data coming back:
            const data = {
                longitude: centerNode[1] ,
                latitude: centerNode[0] ,
                placename
            }
     */
    geocode(req.query.address, (error, data) => {
        if(error) {
            return res.send({
                errorMsg: 'Error occured accessing Mapbox with address=' + req.query.address + ' to get GEO coordinates.' ,
                error
            })  
        }

        /**
         * Structure of data:
             const data = {
                summary: dailyTodaySummaryNode
             }
         */
        forecast(data.latitude, data.longitude, (error, data) => {
            if(error) {
                return res.send({
                    errorMsg: 'Error occured getting Weather forecast !' ,
                    error
                })  
            }

            res.send({
                location: req.query.address ,
                weatherForecastSummary: data.summary ,
                weatherForecastHumidity: data.humidity ,
                weatherForecastTemperatureHigh: data.temperatureHigh ,
                weatherForecastTemperatureLow: data.temperatureLow
            })
        })

    }) ;



    /**
     * Build a hard coded JSON obj and send it back in response object
    const data = {
        forecast: 'Mainly Sunny with minimal clouds' ,
        location: 'Boca Raton, FL' ,
        address: req.query.address
    }
    res.send(data) ;
    **/
})

app.get('/products', (req, res) => {
    console.log(req.query) ;

    // handle Edge case: DONT Display products when "search" is not provided as querystring
    if(!req.query.search) {
        /** IMPORTANT use the "return" if you want the method to exit upon execution of this piece of logic and not continue processing **/
        return res.send({
            error: 'You must provide a Search Term for Products search!'
        })
    }

    res.send({
        products: []
    })
})

// SPECIFIC PATTERN MATCHING with Wild Card : 
// mapping for /help/ANYTHING 
app.get('/help/*' , (req, res) => {
    res.render('error', {
        title: 'Error Page' ,
        error : 'Help Article not Found'
    }) ;
}) ;

// ## IMPORTANT: [setup for ERROR / BAD url paths] : HAS to be the LAST configuration PER ExpressJs behavior. It 
// goes in looking for matchs IN THE ORDER things are declared here. 
// '*' is provided by express as the wild card to match everything.
app.get('*' , (req, res) => {
    res.render('error', {
        title: 'Error Page' ,
        error : 'Page not Found'
    }) ;
}) ;


// START UP Server (ExpressJS lib) ... access it locally via http://localhost:3000/
// You can use 3000 locally, but when you deploy it on heroku it will be provided to you via an Env Var .. simply use the const "port"
app.listen(port, () => {
    console.log('Server is up on port 3000') ;
}) ;