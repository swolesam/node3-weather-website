const request = require('request') ;
const chalk = require('chalk') ;

// this method will call mapbox and get back coordinates and place them into 1 object 'data'
const geocode = (location, callbackMethod) => {

    const mapBoxUrl_2_1 = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const mapBoxUrl_2_2 = '.json?access_token=pk.eyJ1Ijoid2ViZ3VydTEyMyIsImEiOiJjand3d2t2YmYwMTI5NGNtZ2llcWp1Z2xjIn0.tEAJkZiWUBg_NpsM9Xc3vA&limit=1' ;
    const url = mapBoxUrl_2_1 + location + mapBoxUrl_2_2 ;

    // use ES6 shorthand 
    // request({url, json: true}, (error, {response.body}) => {
    request({url : url, json: true} , (error, response) => {    
        //** GeoCoding (putting a location in & getting back X.Y coords) , BEST to use API for that **/
        // Address => Latitude/Longitude => Weather
        if(error) {
            // LOW LEVEL edge cases
            callbackMethod('Low Level Edge Case Scenario occured!', undefined) ;
    
        }  else if(response.body.features.length < 1) {
            // use the features Array Size (length) to determine if location was found
            callbackMethod('Cant find location requested. Try another Location', undefined) ;
        
        } else {
            const ft0 = response.body.features[0] ;
            const centerNode = ft0.center ;
            const placename = ft0.place_name ;
            //console.log(ft0) ;
            //console.log('Latitude:=' + chalk.bgYellow(centerNode[0]) + ' , Longitude=' + chalk.bgYellow(centerNode[1]) ) ;
            const data = {
                longitude: centerNode[1] ,
                latitude: centerNode[0] ,
                placename
            }
            callbackMethod(undefined, data) ;
        }
    })
}

module.exports = geocode ;