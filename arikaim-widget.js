/**
 *  Arikaim
 *  @copyright  Copyright (c) Intersoft Ltd <info@arikaim.com>
 *  @license    http://www.arikaim.com/license.html
 *  http://www.arikaim.com
 */
'use strict';

(function() {
    const ARIKAIM_WIDGET_VERSION = '0.5.1';

    function loadScript(url, onLoad, async) {
        var script = document.createElement('script');
        script.src = url;
        if (async == true) {
            script.setAttribute('async','async');
        }
        if (typeof onLoad !== 'undefined') {
            script.onload = onLoad;
        }
    
        (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script);     
    }

    function loadCss(url) {

    };

    function request(method, url, onSuccess, onError) {
        $.ajax({
            url: url,
            method: method,          
            data: {},
            crossDomain: true,
            beforeSend: function(request) {
                request.setRequestHeader('Accept','application/json; charset=utf-8');
            },
            success: function(data) {   
            },
            error: function(xhr,status,error) {
            }
        });   
    }

    console.log('Arikaim Widget version ' + ARIKAIM_WIDGET_VERSION);

    var currentScript = document.currentScript;
    var url = new URL(currentScript.src);


    console.log(url);

    const LIBRARY_URL = url.href.replace('widget/arikaim-widget.js','');
    const WIDGET_UUID = currentScript.getAttribute('widget-container');
    const CONTANTER_CLASS = "widget-container-" + WIDGET_UUID;
 
    const ARIKAIM_HOST = url.origin;
    var jQuery, $;

    console.log(WIDGET_UUID);
    console.log(CONTANTER_CLASS);
    console.log(LIBRARY_URL);
 

    // Load Jquery
    loadScript(LIBRARY_URL + 'jquery/jquery-3.4.1.min.js',function() {
        $ = jQuery = window.jQuery.noConflict(true);      
        console.log('jQuery loaded.');

        loadScript(LIBRARY_URL + 'arikaim/arikaim.js',function() {
            //console.log('Arikaim lib loaded.');

            arikaim.setHost(ARIKAIM_HOST);
            arikaim.setBaseUrl('/arikaim');
            loadWidget();
        });
        // Call widget api include files 
        //request(WIDGET_API_URL,function(result) {

        //},funciton(error) {

       // });
    });

    function loadWidget() {
        // include files
        arikaim.get('/api/widget/includes/' + WIDGET_UUID,function(result) {

            result.js.forEach(item => {
                console.log(item);
            });
           
        });
        // fetch content
        
    };

})();