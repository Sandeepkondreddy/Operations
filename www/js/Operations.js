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