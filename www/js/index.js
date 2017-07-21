//var URL = "https://m.buytickets.greateranglia.co.uk/"; //PRODUCTION
var URL = "https://et2-m-greateranglia.ttlnonprod.com/DataPassedIn?Origin=PRE&Destination=MAN&OutboundDate=2017-08-05&OutboundTime=16-53&OutboundSearchType=DepartAt&IsReturn=false&NumberOfAdults=1&NumberOfChildren=0"; //NON-PRODUCTION

var webView, iabOpts, useIAB, osVersion, iab;

function log(msg){
    console.log(msg);
    $('#log').append("<p>"+msg+"</p>");
}

function openIAB(){
    var target = useIAB ? '_blank' : '_system';
    iab = cordova.InAppBrowser.open(URL, target, iabOpts);

    iab.addEventListener('loadstart', function(e) {
        log("received 'loadstart' for URL: "+ e.url);
    });
    iab.addEventListener('loadstop', function(e) {
        log("received 'loadstop' for URL: "+ e.url);
        testInjection();
    });
    iab.addEventListener('loaderror', function(e) {
        log("received 'loaderror' for URL: "+ e.url);
    });
}

function testInjection(){
    iab.executeScript({
        code: "document.getElementsByTagName('h1')[0].innerHTML = document.getElementsByTagName('h1')[0].innerHTML + \" (injected)\";"
    }, function(returnValue){
        returnValue = returnValue[0];

       log("executeScript returned value: " + returnValue);
    });

    iab.insertCSS({
        code: "body *{color: red !important;}"
    }, function(){
        log("insertCSS returned");
    });
}

function onDeviceReady(){
    console.log("deviceready");

    osVersion = parseFloat(device.version);

    if( device.platform === "iOS" ) {
        iabOpts = 'location=no,toolbar=yes';
        if(window.webkit && window.webkit.messageHandlers ) {
            webView = "WKWebView" ;
        }else{
            webView = "UIWebView" ;
        }

        useIAB = osVersion >= 9 && webView === "WKWebView";

    }else{
        iabOpts = 'location=yes';
        if(navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk" ;
        } else {
            webView = "System" ;
        }
        useIAB = osVersion >= 4.4;
    }

    $('#platform').html(device.platform + " " + device.version);
    $('#webview').html(webView);
    $('#popupbridge').html(useIAB ? "YES" : "NO");
}

$(document).on('deviceready', onDeviceReady);
