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
		initDatabase();//showUserRecords();
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
					url: "http://apps.kpcl.com/KPCTSDS/api/Account/ValidateUser/" + $("#txtusername").val().trim() + "/" + $("#txtpassword").val(),   
					/* url: "http://202.83.27.199/TestAPI/api/User/ValidateUser/" + $("#txtusername").val().trim() + "/" + $("#txtpassword").val(),	  	//Act Link.       */          
					/* url: "http://182.72.244.25/KPCTSDS/api/Account/ValidateUser/" + $("#txtusername").val().trim() + "/" + $("#txtpassword").val(),   //Airtel Link. */
                    data: '{}',
                    contentType: "application/json",
                    success: function(data) {
                        if (data[1] == 'True') {
                            $("#hidusrid").val(data[0]);
                            $.ajax({
                                type: "GET",
								url: "http://apps.kpcl.com/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
                                //url: "http://202.83.27.199/TestAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),		//Act Link.						
								/* url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),	//Airtel Link. */
                                data: '{}',
                                contentType: "application/json",
                                success: function(result) {debugger;
									Home=result;insertUserRecord();showUserRecords();
                                   // window.location.href = result + '?user=' + btoa($("#hidusrid").val());
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
		
		$("#btnExit").click(function()
		{
			var state = confirm('Are You Sure you want to Exit.');
			if (state)
            navigator.app.exitApp();
		});
    });
	
	
	// Get Mobile Time Section ---Start---
		function getDateTime()
		{
			var currentdate = new Date().toLocaleString(); 
				//alert(currentdate); 
			 var n1 =currentdate.split(' ');//109
			 var n2=n1[0].split('/');
			 //var date=n2[2].substr(0, n2[2].length - 1)+'-'+n2[0]+'-'+n2[1];
				var time = am_pm_to_hours(n1[1]+' '+n1[2]);
				var year=n2[2].substr(0, n2[2].length - 1);
				var month=n2[0];
				if(month.length==1)month='0'+n2[0];
				var day=n2[1];
				if(day.length==1)day='0'+n2[1];
			 //var datetime=year+'-'+month+'-'+day +' '+time;  //System Time
			 var datetime=year+'-'+month+'-'+day+' '+time;	//Mobile Time
			 if(datetime.length>19){
			 datetime=year+'-'+day+'-'+month +' '+time;		 
			 datetime=datetime.substr(0,datetime.length-7); //Mobile Tiem
			 }
			 return (datetime);
		}
		
		//Time Covertion
		function am_pm_to_hours(time) 
		{
				console.log(time);
				var hours = Number(time.match(/^(\d+)/)[1]);
				var minutes = Number(time.match(/:(\d+)/)[1]);
				var AMPM = time.match(/\s(.*)$/)[1];
				if (AMPM == "PM" && hours < 12) hours = hours + 12;
				if (AMPM == "AM" && hours == 12) hours = hours - 12;
				var sHours = hours.toString();
				var sMinutes = minutes.toString();
				//var sSecons=
				if (hours < 10) sHours = "0" + sHours;
				if (minutes < 10) sMinutes = "0" + sMinutes;
				var sec=time.split(':');
				return (sHours +':'+sMinutes+':'+sec[2].substr(0, sec[2].length - 3));
		}
	// Get Mobile Time Section ---End---
	
	
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
					 createUserTable();  // If supported then call Function for create table in SQLite
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
		 
		//--SQLLite  Table Creation
		var createUserTableStatement = "CREATE TABLE IF NOT EXISTS UserTbl (Id INTEGER PRIMARY KEY AUTOINCREMENT, IMEI TEXT, LoginId TEXT, Password TEXT,HomePage TEXT,CreatedTime TEXT)";
		function createUserTable()  // Function for Create Table in SQLLite.
		{
			db.transaction(function (tx) { tx.executeSql(createUserTableStatement, [], TableCeationMessage, onError); });			
		}
		function TableCeationMessage()
		{
			//document.getElementById('lblmessage').innerHTML = 'Offline User Table Created Successfully.!';
			//alert('Offline User Table Created Successfully.!');
		}
		function onError(tx, error) // Function for Hendeling Error...
		{
			alert(error.message);
		}
		
		//--SQLLite Save Details
		var insertUserDetailsStatement = "INSERT INTO UserTbl (IMEI, LoginId, Password, HomePage, CreatedTime) VALUES (?, ?, ?, ?, ?)";
		var Home;
		function insertUserRecord() // Get value from Input and insert record . Function Call when Save/Submit Button Click..
		{debugger;
				var LoginIdTemp = document.getElementById("txtusername").value.trim();
				var PasswordTemp = document.getElementById("txtpassword").value.trim();
				var IMEITemp =document.getElementById('hidIMEI').value;
				var HomePageTemp=Home;				
				var CreatedTimeTemp =getDateTime();
				//var CreatedByTemp=$("#hidusrid").val();
				db.transaction(function (tx) { tx.executeSql(insertUserDetailsStatement, [IMEITemp, LoginIdTemp, PasswordTemp, HomePageTemp, CreatedTimeTemp], SaveUserDataMessage, onError); });
		}
		function SaveUserDataMessage() //Function for Load and Reset...
		{     
			alert (' Offline User Data Saved Successfully.!');			
			//document.getElementById('lblmessage').innerHTML = 'Offline User Data Saved Successfully.!';			
		}
		
		// Function For Retrive data from Database
		var selectAllStatement = "SELECT * FROM UserTbl";
		var userDataset;
		function showUserRecords() // Function For Retrive data from Database Display records as list
		{debugger;
			 db.transaction(function (tx) {
				 tx.executeSql(selectAllStatement, [], function (tx, result) {
					 userDataset = result.rows;
					 if(userDataset.length==0)
					 {				 
						 //document.getElementById('lblmessage').innerHTML = 'Offline User Data Not Available.!';
						 //alert (' Offline User Data Not Available.!');	
					 }
					 else{
						 //document.getElementById('lblmessage').innerHTML = dataset.length+ ' Offline User Data Available.!';
						// alert (' Offline User Data Available.!');	
					 }
					 for (var i = 0, item = null; i < userDataset.length; i++) {
						item = userDataset.item(i);
						//alert('Id:'+item['Id']+ ', IMEI:'+item['IMEI']+', LoginId:'+item['LoginId']+', Password:'+item['Password']+', HomePage:'+item['HomePage']+',  CreatedTime:'+item['CreatedTime']);						 
						 window.location.href = item['HomePage'] + '?user=' + btoa($("#hidusrid").val());
					 }
					 
				 });
			 });
			  
		 }
		
		//  Declare SQL Query for SQLite --User Details
			
	
	//  Internal (SQL Lite) DB Section-----End---	User Details