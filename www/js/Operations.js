var qsParm = new Array(), oldvalue = "";
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    $("#hiduuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
    nfc.enabled(function(){        
        lblerr.innerHTML = "Tap nfc tag to read";
        nfc.addNdefListener(
            function (record){
                $("#loading").show();
                txttruckno.value = "";
                var tagdata = record.tag.ndefMessage[0]["payload"];
                var label = document.createTextNode(nfc.bytesToString(tagdata));
                //txttruckno.value = label.data.substring(3);
                txttag.value=label.data.substring(3);
                txttruckno.value="";
                lblerr.innerHTML = "";
                btnSubmit.style.display = 'none';
                btnClear.style.display = 'none';
				//document.getElementById("btnSubmit").disabled = true;
				
                //GetTruckDetails(label.data.substring(3));//Added for fetching truck details on NFC read
                oldvalue = "";
                //GetDeviceStatus();
                //GetTag_TruckDetails(label.data.substring(3));//Added for fetching truck details on NFC read				
                //GetDeviceStatus();
                //Reason();
                //GetUserStages($("#hidusrid").val());
                $("#loading").hide();
            },
            function(){
                lblerr.innerHTML = "";
            },
            function(){
                lblerr.innerHTML = "Error in reading tag.";
        });
    },
    function(){
        lblerr.innerHTML = "";
    });
}

function scanTag()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                 $("#txttruckno").val("");
                 $("#txttag").val(result.text);
                 //oldvalue = "";
                 //GetDeviceStatus();
				 GetTagDetails(result.text);
                 //GetTag_TruckDetails(result.text);//Added for fetching truck details on QR-Code Scan
				 //alert('Tag No:'+result.text);
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

function scanTruck()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                $("#txttruckno").val(result.text);
                $("#txttag").val("");
                //oldvalue = "";
               // GetDeviceStatus();
                //GetTruckDetails(result.text);//Added for fetching truck details on QR-Code Scan
				alert('Truck No:'+result.text);
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}


function GetTagDetails(tagno)
{
    var TagNo = tagno == "" ? "" : tagno;
	$("#loading").show();
    if(TagNo != "")
    {
        $.ajax({
			//url: 'http://localhost:51594/api/Operations/GetTagDetails/' + TagNo,
           url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/GetTagDetails/' + TagNo,

            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
					$("#hidVTId").val(result[0].VTId);
                    $("#txttruckno").val(result[0].TruckNo);
                    $("#txtOpCode").val(result[0].OperationCode);
                    $("#txtCStage").val(result[0].CurrentStageName);
					//$("#txtCStageTime").val(result[0].CurrentStageId);
					$("#txtOperation").val(result[0].Operation);
					$("#btnSubmit span").text(result[0].NextStageName);
					$("#hidNStageId").val(result[0].NextStageId);
					alert(result[0].NextStageId+ "/" + $("#hidusrid").val());
					//validateuserstage(result[0].NextStageId);
					        $.ajax({
									//url: 'http://localhost:51594/api/Operations/GetTruckDetails/' + TagNo,
								   url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/ValidateUserStage/' + result[0].NextStageId+ '/' + $("#hidusrid").val(), 
									
									type: 'GET',
									data: '{}',
									dataType: 'application/json',
									async: false,
									success: function (data) {
										if (data[1] == 'True') {
											$("#btnSubmit").attr('disabled',false);
										}
										else {
											$("#btnSubmit").attr('disabled',true);
										}
									},
									error: function () {
										alert('Error occurred while loading Stage Access details.');
										//$("#imgtruck").hide();
										
									}
								});
                }
                else {
                    $("#lblerr").text("No Data Found");
                    $("#txttag").val("");//clearing the Tag details in case of no data found for tag
                    $("#lblerr").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                //$("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    }
}

function GetTruckDetails(truckno)
{
    var TruckNo = truckno == "" ? "" : truckno;
	$("#loading").show();
    if(TruckNo != "")
    {
        $.ajax({
			//url: 'http://localhost:51594/api/Operations/GetTruckDetails/' + TagNo,
           url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/GetTruckDetails/' + TruckNo,

            type: 'GET',
            data: '{}',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.length > 0) {
					$("#hidVTId").val(result[0].VTId);
                    $("#txttag").val(result[0].TagNo);
                    $("#txtOpCode").val(result[0].OperationCode);
                    $("#txtCStage").val(result[0].CurrentStageName);
					//$("#txtCStageTime").val(result[0].CurrentStageId);
					$("#txtOperation").val(result[0].Operation);
					$("#btnSubmit span").text(result[0].NextStageName);
					$("#hidNStageId").val(result[0].NextStageId);
					validateuserstage(result[0].NextStageId);
                }
                else {
                    $("#lblerr").text("No Data Found");
                    $("#txttag").val("");//clearing the Tag details in case of no data found for tag
                    $("#lblerr").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                //$("#imgtruck").hide();
                
            }
        });
    }
	$("#loading").hide();
}

function validateuserstage(stageid){
	alert(stageid); 
	var StageId = stageid == "" ? "" : stageid;	
    if(StageId != "")
    {
        $.ajax({
			//url: 'http://localhost:51594/api/Operations/GetTruckDetails/' + TagNo,
           url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Operations/ValidateUserStage/' + StageId+ "/" + $("#hidusrid").val(), 
				alert(url);
            type: 'GET',
            data: '{}',
            dataType: 'application/json',
            async: false,
            success: function (data) {
                if (data[1] == 'True') {
					$("#btnSubmit").attr('disabled',false);
                }
                else {
					$("#btnSubmit").attr('disabled',true);
                }
            },
            error: function () {
                alert('Error occurred while loading Stage Access details.');
                //$("#imgtruck").hide();
                
            }
        });
    }
	
}

function clear()
{
	$("#btnSubmit span").text('Save');
	$("#btnSubmit").attr('disabled',true);
    //this.submit();
	txttag.value="";
	hidVTId.value="";
    txttruckno.value="";
    txtOpCode.value="";
    txtCStage.value="";
	txtOperation.value="";
	hidNStageId.value="";
}
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

    if (parms.length > 0 && query != "") {
        $("#hidusrid").val(atob(qsParm["user"]));
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}
$(document).ready(function () {debugger;
	qs();
	
	//alert($("#hidusrid").val());
		clear();
	
	    $("#imgScanTag").click(function () {
        $("#loading").show();	
        scanTag();
        //GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });

    $("#imgScanTruckNo").click(function () {
        $("#loading").show();
        $("#txtstatus").text("");
        
        //GetDeviceStatus();
        scanTruck();
        Reason();
        //GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });
	
	$("#btnClear").click(function() {
       clear();
        });
	
	$("#home").click(function () {
        $.ajax({
            type: "GET",
            url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),
	    //url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });
	
	
	});