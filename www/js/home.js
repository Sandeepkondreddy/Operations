document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    window.plugins.imeiplugin.getImei(callback);	
}
function callback(imei) {
    $("#hidIMEI").val(imei);
}
function onBackKeyDown() {
    }
var qsParm = new Array();
function qs() {
        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i = 0; i < parms.length; i++) {
            var pos = parms[i].indexOf('=');
            if (pos > 0) {
                var key = parms[i].substring(0, pos);
                var val = parms[i].substring(pos + 1);
                qsParm[key] = val;
            }
        }
        if (parms.length > 0) {
            $("#hidusrid").val(atob(qsParm["user"]));
            return true;
        }
        else {
            window.location.href = 'Login.html';
            return false;
        }
}

$(document).ready(function(){
        qs();		
        $("#loading").hide();
        $(".box7").click(function(){
            $("#loading").show();
            window.location.href = 'Operations.html?user=' + btoa($("#hidusrid").val()) + '';
        });
});