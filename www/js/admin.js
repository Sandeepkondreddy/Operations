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

$(document).ready(function(){
        qs();
		showUserRecords();
        $("#loading").hide();
        $(".box1").click(function(){
            $("#loading").show();
            window.location.href = 'RegDevice.html?user=' + btoa($("#hidusrid").val()) + '';
        });
        $(".box2").click(function(){
            $("#loading").show();
            window.location.href = 'StageMapping.html?user=' + btoa($("#hidusrid").val()) + '';
        });
        $(".box3").click(function(){
            $("#loading").show();
            window.location.href = 'SDS.html?user=' + btoa($("#hidusrid").val()) + '';
        });
});

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


//  Internal (SQL Lite) DB Section-----Start--- 
	
		// --SQLLite Database Creation
		var db = openDatabase("LocalDB", "1.0", "Local Database", 200000);  // Open SQLLite Database
		function initDatabase()  // Function Call When Page is ready.
		{
			 try {
				 if (!window.openDatabase)  // Check browser is supported SQLLite or not.
				 {
					 alert('Databases are not supported in this browser.');
				 }
				 else {
					 //createUserTable();  // If supported then call Function for create table in SQLite
				 }
			 }
		 
			catch (e) {
				 if (e == 2) {
					 // Version number mismatch. 
					 console.log("Invalid database version.");
				 } else {
					 console.log("Unknown error " + e + ".");
				 }
				 return;
			 }
		 }
		 
		 // Function For Retrive User data from Database
		var selectRecentUserStatement = " SELECT * FROM UserTbl where Id=(Select Max(Id) from UserTbl)";
		var userDataset;
		function showUserRecords() // Function For Retrive data from Database Display records as list
		{debugger;
			 db.transaction(function (tx) {
				 tx.executeSql(selectRecentUserStatement, [], function (tx, result) {
					 userDataset = result.rows;
					 if(userDataset.length==0)
					 {				 
						 //document.getElementById('lblmessage').innerHTML = 'Offline User Data Not Available.!';
						 alert (' Offline User Data Not Available.!');	
					 }
					 else{
						 //document.getElementById('lblmessage').innerHTML = dataset.length+ ' Offline User Data Available.!';
						 alert (' Offline User Data Available.!');	
					 }
					 for (var i = 0, item = null; i < userDataset.length; i++) {
						item = userDataset.item(i);
						alert('Id:'+item['Id']+ ', IMEI:'+item['IMEI']+', LoginId:'+item['LoginId']+', Password:'+item['Password']+', HomePage:'+item['HomePage']+',  CreatedTime:'+item['CreatedTime']);						 
						 
					 }
					 
				 });
			 });
		 }
//  Internal (SQL Lite) DB Section-----End--- 