
/**
 * !! IMPORTANT !! 
 * When this is executed from browser, these lines will be printed to the DEVELOPER TOOLS => CONSOLE itself.
 */
console.log('client side Javascript file is loaded.') ;

/** 'fetch' is a browser-based API not NodeJs
// 'then' is part of the "promises" APIs and the Asynch-awaits
fetch('http://puzzle.mead.io/puzzle').then( (response) => {
    
    // this means when the json data has arrived & parsed
    response.json().then( (data) => {
        console.log(data) ;
    })
})
**/

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')

const message1 = document.querySelector('#message-1') ;
const message2 = document.querySelector('#message-2') ;

// message1.textContent = 'HELLO' ;


weatherForm.addEventListener('submit' , (e) => {
    // call preventDefault() on the Event (e) to prevent the browser from reloading the page on submit, instead 
    // execute the code we have impl here.
    e.preventDefault()

    const location = search.value ;

    message1.textContent = 'Loading... ' ;
    message1.textContent = '' ;

    const url = 'http://localhost:3000/weather?address=' + location ;

    fetch(url).then( (response) => {
        /** mess up the url above, and execute again... 
         * Error in Dev DEveloper Tools => Console =>
         *   localhost/:1 Uncaught (in promise) SyntaxError: Unexpected token < in JSON at position 0
         */
        response.json().then( (data) => {
            /**
                location: req.query.address ,
                weatherForecast: data.summary
            */
        if(data.error) {
            message1.textContent = data.error ;
        } else {
            message1.textContent = data.location ; 
            message2.textContent = data.weatherForecast ;
        }

        })
    })
    
})