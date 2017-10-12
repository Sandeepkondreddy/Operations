var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    $("#hiduuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
}
function callback(imei) {
    $("#hidimei").val(imei);
}
function onBackKeyDown() {
}
function qs() {ValidateDevice();
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
$(document).ready(function () {
    $("#loading").hide();
    qs();
    //GetDeviceStatus();

    $("#home").click(function () {
        $.ajax({
            type: "GET",
			url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),
            //url: "http://202.83.27.199/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
	        //url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });

	$(".box7").click(function(){
            $("#loading").show();
            window.location.href = 'Operations.html?user=' + btoa($("#hidusrid").val()) + '';
        });
	
    /* $("#btnSubmit").click(function (){

            $(this).find("i.fa").attr('class', 'fa fa-spinner fa-spin');
            $(this).find("span").text(" device is registering please wait...");
            $(this).attr('disabled', true);
            $(this).attr('class', 'btn btn-custom-icon');
            $("#loading").show();
            var Adddata = {};
            Adddata.IMEI = $("#hidimei").val();
            Adddata.UUID = $("#hiduuid").val();            
            Adddata.User = $("#hidusrid").val();
            $.ajax({
                type: 'POST',
                url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Device/RegisterDevice',
                dataType: "json",
                data: Adddata,
                success: function (loctyperesult) {
                    alert('Device Registered Successfully');
                },
                error: function (xhr, status, error) {
                    $("#btnSubmit").prop('disabled', false);
                    alert('Error Occurred while Registring device.\n\r' + xhr.responseText);
                }
            });      
        $(this).find("i.fa").attr('class', 'fa fa-check');
        $(this).find("span").text(" Submit");
        $(this).attr('disabled', false);
        $(this).attr('class', 'btn btn-custom');
        $("#loading").hide();
    }); */
});

function ValidateDevice(){
	
	
					$.ajax({
                                type: "GET",
								url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/DeviceValidate/" + $("#hidimei").val()+"/"+$("#hiduuid").val(),
                                data: '{}',
                                contentType: "application/json",
                                success: function(result) {
									if (result == "Registered") {
										alert('Device Already Registered.');
										$("#btnSubmit").attr('disabled',false);
										}
										else {
											alert('Device Not Registered, Please contact IT Team.');
											$("#btnSubmit").attr('disabled',true);
										} 
                                    
                                },
								error: function () {
									alert('Error Occurred while getting Details');
								}
                            });
/*     var Adddata = {};
    //Adddata.IMEI = $("#hidimei").val();
    //Adddata.UUID = $("#hiduuid").val();
	Adddata.IMEI = '867634029115001';
    Adddata.UUID = 'c776f47a7e1724cc';
    $.ajax({
        type: "POST",
        //url: "http://apps.kpcl.com/KPCLOpsAPI/api/Device/ValidateDevice",	
		url: "http://localhost:51594/api/Device/ValidateDevice",	
        dataType: "json",
        data: Adddata,
        success: function (result) {          
			if (result != "--") {
                alert('Device Already Registered.');
				$("#btnSubmit").attr('disabled',false);
            }
            else {
				alert('Device Not Registered, Please contact IT Team.');
				$("#btnSubmit").attr('disabled',true);
            } 
        },
        error: function () {
            alert('Error Occurred while getting Device Status');
        } */
    });
}
