/**
 *  Arikaim
 *  @copyright  Copyright (c) Intersoft Ltd <info@arikaim.com>
 *  @license    http://www.arikaim.com/license.html
 *  http://www.arikaim.com
 */
'use strict';

(function() {
    var ARIKAIM_WIDGET_VERSION = '1.0.2';

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
    var CONTANTER_ID = "widget-container-" + WIDGET_UUID;
    var ARIKAIM_HOST = url.origin;
    var REMOTE_URL = ARIKAIM_HOST + '/' + BASE_URL;
  
    // Load jQuery
    loadScript(LIBRARY_URL + 'jquery/jquery-3.6.1.min.js',function() {
        loadScript(LIBRARY_URL + 'arikaim/arikaim.js',function() {
            arikaim.setHost(ARIKAIM_HOST);
            arikaim.setBaseUrl(REMOTE_URL);

            loadScript(LIBRARY_URL + 'arikaim-ui/arikaim-ui.js',function() {              
                loadWidget();          
            });
        });       
    });

    function loadWidget() {
        arikaim.get('/api/widgets/component/' + WIDGET_UUID,function(result) {
            loadWidgetJsFiles(result.include.js,function(loaded) {
                loadWidgetCssFiles(result.include.css);
                
                // load component
                arikaim.ui.loadComponent({
                    mountTo: CONTANTER_ID,
                    component: result.component,
                    params: {
                    }
                });
            });
        });
    };

    function loadWidgetJsFiles(items, onSuccess) {
        console.log('Load widget js files.');
        var loaded = 0;       

        items.forEach(function(item) {
            var url = REMOTE_URL + item;   
            loadScript(url,function() {
                console.log('Wiget js include file loaded: ' + url);
                loaded++;
                if (loaded >= items.length) {
                    onSuccess(loaded);
                    return;
                }
            });                         
        }); 
    }

    function loadWidgetCssFiles(items) {
        console.log('Load widget css files.');

        items.forEach(function(item) {
            var url = REMOTE_URL + item; 
            arikaim.includeCSSFile(url);
            console.log('Wiget css include file loaded: ' + url);                
        }); 
    }

})();