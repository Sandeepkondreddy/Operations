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
				$("#btnSubmit").prop('disabled', true);
                //GetTruckDetails(label.data.substring(3));//Added for fetching truck details on NFC read
                oldvalue = "";
                GetDeviceStatus();
                //GetTag_TruckDetails(label.data.substring(3));//Added for fetching truck details on NFC read				
                //GetDeviceStatus();
                Reason();
                GetUserStages($("#hidusrid").val());
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
				 alert('Tag No:'+result.text);
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
    if(TagNo != "")
    {
        $.ajax({
			url: 'http://localhost:51594/api/Operations/GetTagDetails/' + TagNo,
           // url: 'http://202.83.27.199/KPCTSDS/api/TruckDetails/GetTagTruckDetails/' + TagNo,
	    //url: 'http://182.72.244.25/KPCTSDS/api/TruckDetails/GetTagTruckDetails/' + TagNo,
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
                    $("#btnSubmit").show();
                    $("#btnClear").show();
                   /*  if(oldvalue == "")
                        oldvalue = result[0].NextStatus;
                    $("#btnSubmit").attr('disabled', false);
                    $("#btnSubmit").attr('class', 'btn btn-custom');
                    $("#btnSubmit").html("<i class='fa fa-check'></i>");
                    if($("#hidStatusId").val() == 5 && $("#hidloctype").val() == 1 && $("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else if($("#hidStatusId").val() == 5 && $("#hidloctype").val() == 2 && $("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else if(result[0].NextStatus == "" || $("#hidloctype").val() == "" || $("#hidloctype").val() == "--" || $("#hidStatusId").val() == "")
                        $("#btnSubmit").attr('disabled', true);
                    if($("#hidNewStatus").val() == "ACTIVITY END")
                        $("#btnSubmit").html("<i class='fa fa-check'></i> Tally Sheet");
                    else
                        $("#btnSubmit").html("<i class='fa fa-check'></i> " + result[0].NextStatus);
                    DisableButton(result[0].NextStatus, result[0].LocType, $("#hidloctype").val()); */
                }
                else {
                    $("#lblerr").text("No Data Found");
                    $("#txttag").val("");//clearing the Tag details in case of no data found for tag
                    $("#lblerr").attr('class', 'text-danger');
                }
            },
            error: function () {
                alert('Error occurred while loading Truck details.');
                $("#imgtruck").hide();
                $("#loading").hide();
            }
        });
    }
}


$(document).ready(function () {
	
	
	
	    $("#imgScanTag").click(function () {
        $("#loading").show();
        oldvalue = "";
        //GetDeviceStatus();
        scanTag();
        //Reason();
        //GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });

    $("#imgScanTruckNo").click(function () {
        $("#loading").show();
        $("#txtstatus").text("");
        oldvalue = "";
        //GetDeviceStatus();
        scanTruck();
        Reason();
        //GetUserStages($("#hidusrid").val());
        $("#loading").hide();
    });
	});