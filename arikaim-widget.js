/**
 *  Arikaim
 *  @copyright  Copyright (c) Intersoft Ltd <info@arikaim.com>
 *  @license    http://www.arikaim.com/license.html
 *  http://www.arikaim.com
 */
'use strict';

(function() {
    var ARIKAIM_WIDGET_VERSION = '1.0.0';

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

    console.log('Arikaim Widget version ' + ARIKAIM_WIDGET_VERSION);

    var currentScript = document.currentScript;
    var url = new URL(currentScript.src);

    var BASE_URL = url.href.split('/')[3];
    var LIBRARY_URL = url.href.replace('widget/arikaim-widget.js','');
    var WIDGET_UUID = currentScript.getAttribute('widget-container');
    var CONTANTER_CLASS = "widget-container-" + WIDGET_UUID;
    var ARIKAIM_HOST = url.origin;
    var REMOTE_URL = ARIKAIM_HOST + '/' + BASE_URL;
   // var jQuery, $;

   // console.log(ARIKAIM_HOST);    
   // console.log(CONTANTER_CLASS);
   // console.log(LIBRARY_URL);
 
    // Load Jquery
    loadScript(LIBRARY_URL + 'jquery/jquery-3.6.1.min.js',function() {
       // $ = jQuery = window.jQuery.noConflict(true);      
        console.log('jQuery loaded.');
        loadScript(LIBRARY_URL + 'arikaim/arikaim.js',function() {
            console.log('Arikaim lib loaded.');
            arikaim.setHost(ARIKAIM_HOST);
            arikaim.setBaseUrl(ARIKAIM_HOST + '/ai');
           
            loadWidget();          
        });       
    });

    function loadWidget() {
        // include files
        arikaim.get('/api/widgets/component/' + WIDGET_UUID,function(result) {
        
            loadWidgetIncludeFiles(result.include.js,function() {
                loadWidgetFiles(result.component.js,function() {
                    // load css file

                    console.log(result.component);
                    console.log(REMOTE_URL + '/arikaim/view/templates/blog/components/widget/widget.css');

                    arikaim.includeCSSFile(REMOTE_URL + '/arikaim/view/templates/blog/components/widget/widget.css')
                    console.log('Widget loaded.');
                    $('.' + CONTANTER_CLASS).html(result.component.html);
                    render();
                });
            });

        }); 
    };

    function loadWidgetIncludeFiles(items, onSuccess) {
        console.log('Load widget include files.');
        var loaded = 0;

        items.forEach(function(item) {
            var url = REMOTE_URL + item              
            loadScript(url,function() {
                console.log('Library file loaded: ' + url);
                loaded++;
                if (loaded => items.length) {
                    onSuccess(loaded);
                    return;
                }
            });                         
        }); 
    }

    function loadWidgetFiles(items, onSuccess) {
        console.log('Load widget files.');
        var loaded = 0;

        items.forEach(function(item) {
            var url = ARIKAIM_HOST + item.url             
            loadScript(url,function() {
                console.log('Widget component file loaded: ' + url);
                loaded++;
                if (loaded => items.length) {
                    onSuccess(loaded);
                    return;
                }
            });                         
        }); 
    }

})();