document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    window.plugins.imeiplugin.getImei(callback);
	//var options = {frequency: 3000, enableHighAccuracy: true};
    //navigator.geolocation.watchPosition(onSuccess, onError, options);	
}
function callback(imei) {
    $("#hidIMEI").val(imei);
}
function onBackKeyDown() {
        var state = confirm('Are You Sure you want to Exit.');
        if (state)
            navigator.app.exitApp(); // exit the app
    }

var url = "";	
 $(document).ready(function() {
        $("#txtusername").focus();
        $("#btnSubmit").click(function() {
            var $btn = $("#btnSubmit");
			
            if ($("#txtusername").val() == "") {
                alert('Enter User Name.');
                $("#txtusername").focus();
                return false;
            } else if ($("#txtpassword").val() == "") {
                alert('Enter Password.');
                $("#txtpassword").focus();
                return false;
            } else {
                $btn.find("i.fa").attr('class', 'fa fa-spinner fa-spin fa-lg');
                $btn.find("span").text("Logging in please wait...");
                $btn.attr('disabled', true);
                $btn.attr('class', 'btn btn-custom-icon');
                $("#txtusername").attr('disabled', true);
                $("#txtpassword").attr('disabled', true);
                $.ajax({
                    type: "GET",
					url: "http://202.83.27.199/TestAPI/api/User/ValidateUser/" + $("#txtusername").val().trim() + "/" + $("#txtpassword").val(),	  	//Act Link.                
					//url: "http://182.72.244.25/KPCTSDS/api/Account/ValidateUser/" + $("#txtusername").val().trim() + "/" + $("#txtpassword").val(),   //Airtel Link.
                    data: '{}',
                    contentType: "application/json",
                    success: function(data) {
                        if (data[1] == 'True') {
                            $("#hidusrid").val(data[0]);
                            $.ajax({
                                type: "GET",
                                url: "http://202.83.27.199/TestAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),		//Act Link.						
								//url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),	//Airtel Link.
                                data: '{}',
                                contentType: "application/json",
                                success: function(result) {
                                    window.location.href = result + '?user=' + btoa($("#hidusrid").val());
                                }
                            });
                        } else {
                            $btn.find("i.fa").attr('class', 'fa fa-sign-in fa-lg');
                            $btn.find("span").text("Login");
                            $btn.attr('disabled', false);
                            $btn.attr('class', 'btn btn-custom');
                            $("#txtusername").attr('disabled', false);
                            $("#txtpassword").attr('disabled', false);
                            $("#txtpassword").val("");
                            $("#txtusername").focus();
                            alert("Invalid User Name or Password");
                        }
                    },
                    error: function() {
                        $btn.find("i.fa").attr('class', 'fa fa-sign-in fa-lg');
                        $btn.find("span").text("Login");
                        $btn.attr('disabled', false);
                        $btn.attr('class', 'btn btn-custom');
                        $("#txtusername").attr('disabled', false);
                        $("#txtpassword").attr('disabled', false);
                        $("#txtpassword").val("");
                        $("#txtusername").focus();
                        alert("Invalid User Name or Password");
                    }
                });
            }
        });
    });