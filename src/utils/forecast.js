const request = require('request') ;
const chalk = require('chalk') ;

const darkSkyUrl = 'https://api.darksky.net/forecast/4b0e206fcbced52f3e0972201b28c3e7' ;

const forecast = (longitude, latitude, callbackMeth) => {
    const url = darkSkyUrl + '/' + latitude + ',' + longitude ;

    // use ES6 shorthand 
    // request({url, json: true}, (error, {body}) => {
    request({url: url, json: true}, (error, response) => {
        if(error) {
            // catch [Low-Level Errors] : network errors, unreachable servers errors,...etc.
            callbackMeth(error, undefined) ;

        // ES6 Destruct 
        // } else if(body.error) {
        } else if(response.body.error) {
            // catch Client-sent Programatic errors {code, error}
            callbackMeth(response.body.error, undefined) ;

        } else {
            const dailyNode = response.body.daily ;
            const dailyTodayNode = dailyNode.data[0] ;
            const dailyTodaySummaryNode = dailyTodayNode.summary ;
            console.log(chalk.yellow('Todays summary =', dailyTodaySummaryNode));

            const data = {
                summary: dailyTodaySummaryNode
            }

            callbackMeth(undefined, data) ;
        }

    })

}

module.exports = forecast ;