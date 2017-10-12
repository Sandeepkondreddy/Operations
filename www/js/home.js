var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
   document.addEventListener("backbutton", onBackKeyDown, false);
    $("#hidUUId").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
}
function callback(imei) {
    $("#hidIMEI").val(imei);
}
function onBackKeyDown() {
    }
//var qsParm = new Array();
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

function ValidateDevice(){
    var Adddata = {};
    Adddata.IMEI = $("#hidIMEI").val();
    Adddata.UUID = $("#hidUUId").val();
    $.ajax({
        type: "POST",
        url: "http://apps.kpcl.com/KPCLOpsAPI/api/Device/ValidateDevice",
	//url: "http://182.72.244.25/KPCTSDS/api/Account/GetDeviceStatus",
        dataType: "json",
        data: Adddata,
        success: function (result) {          
			if (result != "--") {
                alert('Device Already Registered.');
            }
            else {
				alert('Device Not Registered, Please Contact IT Team.');
            } 
        },
        error: function () {
            alert('Error Occurred while getting Device Status');
        }
    });
}