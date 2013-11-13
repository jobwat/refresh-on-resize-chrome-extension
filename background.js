'use strict';

var REGEXP=new RegExp('[&\?]?_device=([a-z]+)');

function guessDeviceFromWidth(width){
  if ( width < 950 ){ return 'mobile'; }
  else if( width < 1500 ){ return 'tablet'; }
  else { return 'desktop'; }
}

function newUrl(prev_url, device){
  var clean_url = prev_url;
  if ( prev_url.match(REGEXP) ){ clean_url=prev_url.replace(REGEXP,'') }
  var delimiter = clean_url.match(/[?=]/) ? '&' : '?';
  return clean_url + delimiter + '_device=' + device;
}

chrome.extension.onRequest.addListener(function(request) {

  if (request.method === 'resize') {
    var width;
    chrome.windows.getCurrent( function(w) { width = w.width; });
    chrome.tabs.getSelected(null, function(tab){
      var device_should = guessDeviceFromWidth(width);
      var device_is=tab.url.match(REGEXP)[1];
      if(device_should==device_is){ 
        console.log(width + 'px : Device is already ' + device_is);
      }
      else{
        console.log(width + 'px : ', device_should);
        chrome.tabs.update(tab.id, {url: newUrl(tab.url, device_should)});
      }
    });
  }

});



