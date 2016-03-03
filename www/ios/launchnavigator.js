/*
 * Copyright (c) 2014 Dave Alden  (http://github.com/dpa99c)
 * Copyright (c) 2014 Working Edge Ltd. (http://www.workingedge.co.uk)
 *  
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *  
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *  
 */

var ln = {};


/*********
 * v3 API
 *********/
ln.v3 = {};

/**
 * Opens navigator app to navigate to given destination, specified by either place name or lat/lon.
 * If a start location is not also specified, current location will be used for the start.
 *
 * @param {mixed} destination (required) - destination location to use for navigation.
 * Either:
 * - a {string} containing the address. e.g. "Buckingham Palace, London"
 * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 * 
 * @param {object} options (optional) - optional parameters:
 * - {function} successCallback - A callback to invoke when the navigation app is successfully launched.
 *
 * - {function} errorCallback (optional) - A callback to invoke if an error is encountered while launching the app.
 * A single string argument containing the error message will be passed in.
 *
 * - {string} app - name of the navigation app to use for directions.
 * If not specified or the specified app is not installed, defaults to Apple Maps.
 *
 * - {string} destinationName - nickname to display in app for destination. e.g. "Bob's House".
 *
 * - {mixed} start - start location to use for navigation. If not specified, the current location of the device will be used.
 * Either:
 *      - a {string} containing the address. e.g. "Buckingham Palace, London"
 *      - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 *
 * - {string} startName - nickname to display in app for start. e.g. "My Place".
 *
 * - {string} transportMode - transportation mode for navigation.
 * Defaults to "driving" if not specified.
 *
 * - {boolean} enableDebug - if true, debug log output will be generated by the plugin. Defaults to false.
 */
ln.v3.navigate = function(destination, options) {
    options = options ? options : {};

    // Input validation
    if(!destination) throw new Error("destination must be given as an {array} of lat/lon coordinates or a placename {string}");

    // Set defaults
    options.app = options.app ? options.app : ln.v3.APP.APPLE_MAPS;
    options.transportMode = options.transportMode ? options.transportMode : ln.v3.TRANSPORT_MODE.DRIVING;
    options.enableDebug = options.enableDebug ? options.enableDebug : false;

    // Process options
    if(typeof(destination) == "object"){
        destination = destination[0]+","+destination[1];
        options.destType = "coords";
    }else{
        options.destType = "name";
    }

    if(!options.start){
        options.startType = "none";
    }else if(typeof(start) == "object"){
        options.start = options.start[0]+","+options.start[1];
        options.startType = "coords";
    }else{
        options.startType = "name";
    }

    cordova.exec(options.successCallback, options.errorCallback, 'LaunchNavigator', 'navigate', [
        destination,
        options.destType,
        options.destinationName,
        options.start,
        options.startType,
        options.startName,
        options.app,
        options.transportMode,
        options.enableDebug
    ]);

};

/**
 * Determines if the given app is installed and available on the current device.
 * @param {string} appName - name of the app to check availability for. Define as a constant using ln.APP
 * @param {function} success - callback to invoke on successful determination of availability. Will be passed a single boolean argument indicating the availability of the app.
 * @param {function} error - callback to invoke on error while determining availability. Will be passed a single string argument containing the error message.
 */
ln.v3.isAppAvailable = function(appName, success, error){
    if(!appName || !ln.v3.APP[appName]) throw new Error (appName + " is not a supported navigation app on iOS - please use a ln.APP constant");

    cordova.exec(success, error, 'LaunchNavigator', 'isAppAvailable', [appName]);
};

/**
 * Returns a list indicating which apps are installed and available on the current device.
 * @param {function} success - callback to invoke on successful determination of availability. Will be passed a key/value object where the key is the app name and the value is a boolean indicating whether the app is available.
 * @param {function} error - callback to invoke on error while determining availability. Will be passed a single string argument containing the error message.
 */
ln.v3.availableApps = function(success, error){
    cordova.exec(success, error, 'LaunchNavigator', 'availableApps', []);
};

/*********************************
 * v2 legacy API to map to v3 API
 *********************************/
ln.v2 = {};


/**
 * Opens navigator app to navigate to given destination, specified by either place name or lat/lon.
 * If a start location is not also specified, current location will be used for the start.
 *
 * @param {mixed} destination (required) - destination location to use for navigation.
 * Either:
 * - a {string} containing the place name. e.g. "London"
 * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 * @param {mixed} start (optional) - start location to use for navigation. If not specified, the current location of the device will be used.
 * Either:
 * - a {string} containing the place name. e.g. "London"
 * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 * @param {function} successCallback (optional) - A callback which will be called when plugin call is successful.
 * @param {function} errorCallback (optional) - A callback which will be called when plugin encounters an error.
 * This callback function have a string param with the error.
 * @param {object} options (optional) - platform-specific options:
 * {boolean} preferGoogleMaps - if true, plugin will attempt to launch Google Maps instead of Apple Maps. If Google Maps is not available, it will fall back to Apple Maps.
 * {boolean} disableAutoGeolocation - if TRUE, the plugin will NOT attempt to use the geolocation plugin to determine the current device position when the start location parameter is omitted. Defaults to FALSE.
 * {string} transportMode - transportation mode for navigation.
 * For Apple Maps, valid options are "driving" or "walking".
 * For Google Maps, valid options are "driving", "walking", "bicycling" or "transit".
 * Defaults to "driving" if not specified.
 * {string} urlScheme - if using Google Maps and the app has a URL scheme, passing this to Google Maps will display a button which returns to the app
 * {string} backButtonText - if using Google Maps with a URL scheme, this specifies the text of the button in Google Maps which returns to the app. Defaults to "Back" if not specified.
 * {boolean} enableDebug - if true, debug log output will be generated by the plugin. Defaults to false.
 */
ln.v2.navigate = function(destination, start, successCallback, errorCallback, options) {

    // Set defaults
    options = options ? options : {};
    options.preferGoogleMaps = options.preferGoogleMaps ? options.preferGoogleMaps : false;
    options.enableDebug = options.enableDebug ? options.enableDebug : false;

    cordova.exec(options.successCallback, options.errorCallback, 'LaunchNavigator', 'navigate', [
        destination,
        options.destType,
        options.app,
        options.start,
        options.startType,
        options.transportMode,
        options.enableDebug
    ]);

    // Map to and call v3 API
    ln.v3.navigate(destination, {
        app: options.preferGoogleMaps ? ln.v3.APP.GOOGLE_MAPS : ln.v3.APP.APPLE_MAPS,
        start: options.start,
        transportMode: options.transportMode,
        enableDebug: options.enableDebug
    });
};



/**
 * Checks if the Google Maps app is installed and available on an iOS device.
 *
 * @return {boolean} true if Google Maps is installed on the current device
 */
ln.v2.isGoogleMapsAvailable = function(successCallback) {
    ln.v3.isAppAvailable(ln.v3.APP.GOOGLE_MAPS, successCallback);
};


/******************
 * Plugin interface
 ******************/


/**
 * Delegation shim to determine by arguments if API call is v2 or v3 and delegate accordingly.
 */
ln.navigate = function(){
    if(arguments.length >= 2 && (typeof(arguments[1] == "undefined" || typeof(arguments[1] == "object")))){
        ln.v3.navigate.apply(this, arguments);
    }else{
        ln.v2.navigate.apply(this, arguments);
    }
};

/**
 * Map directly to v2 API
 */
ln.isGoogleMapsAvailable = ln.v2.isGoogleMapsAvailable;

/**
 * Map directly to v3 API
 */
ln.isAppAvailable = ln.v3.isAppAvailable;
ln.availableApps = ln.v3.availableApps;


module.exports = ln;