
//online
var apipath="http://eapps001.cloudapp.net/smart_doctor/syncmobile/";

//local
//var apipath="http://127.0.0.1:8000/smart_doctor/syncmobile/";


var latitude="";
var longitude="";



function getLocationInfoAch() {	
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);		
	$(".errorChk").html("Confirming location. Please wait.");
}
// onSuccess Geolocation
function onSuccess(position) {
	$("#q_lat").val(position.coords.latitude);
	$("#q_long").val(position.coords.longitude);
	$(".errorChk").html("Location Confirmed");
}
// onError Callback receives a PositionError object
function onError(error) {
   $("#q_lat").val(0);
   $("#q_long").val(0);
   $(".errorChk").html("Failed to Confirmed Location.");
}

function replace_special_char(string_value){
	var real_value=string_value.replace(')','').replace('(','').replace('{','').replace('}','').replace('[','').replace(']','').replace('"','').replace("'","").replace("/'","").replace("\'","").replace('>','').replace('<','');
	return real_value;
}

$(document).ready(function(){
		$("#wait_image_login").hide();
		$("#loginButton").show();		

			$("#q_lat").val("");
			$("#q_long").val("");
			$("#wait_image_login").hide();
			var url = "#pageHome";
	
		$.mobile.navigate(url);
		
	});

function menuClick(){
	
	var url = "#pageHome";
	$.mobile.navigate(url);
	
}



function get_login() {
	var url = "#login";
	$.mobile.navigate(url);
	}
				
//========================= Longin: Check user
function check_user() {
	var user_id=$("#user_id").val().toUpperCase();
	var user_pass=$("#user_pass").val();
	
	var base_url='';
	var photo_url='';
	
	//-----
	if (user_id=="" || user_id==undefined || user_pass=="" || user_pass==undefined){
		var url = "#login";      
		$.mobile.navigate(url);
		$("#error_login").html("Required User ID and Password");	
	}else{
		//-----------------
					
			if(localStorage.sync_code==undefined || localStorage.sync_code==""){
				localStorage.sync_code=0
			}
			
			//$("#error_login").html(apipath+'passwordCheck?doc_id='+user_id+'&password='+encodeURIComponent(user_pass)+'&sync_code='+localStorage.sync_code);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'passwordCheck?doc_id='+user_id+'&password='+encodeURIComponent(user_pass)+'&sync_code='+localStorage.sync_code,
					 success: function(result) {											
							if (result==''){
								$("#wait_image_login").hide();
								$("#loginButton").show();
								$("#error_login").html('Sorry Network not available');
								
							}else{
								syncResult=result
																
								var syncResultArray = syncResult.split('rdrd');
								//alert (syncResultArray[0]);
								if (syncResultArray[0]=='Success'){													
									
									localStorage.synced=syncResultArray[0];														
									localStorage.sync_code=syncResultArray[1];
									localStorage.chamberStr=syncResultArray[2];
									docProfileStr=syncResultArray[3];
									
									//Profile
									//alert (docProfileStr)
									var profileArray = docProfileStr.split('fdfd');
									localStorage.doc_name=profileArray[0];														
									localStorage.speciality=profileArray[1];
									localStorage.note=profileArray[2];
									localStorage.experience=profileArray[3];
									
									localStorage.user_id=user_id;
									localStorage.user_pass=user_pass
									//alert (localStorage.user_id)
									
									//$("#chamber_list").html(localStorage.chamberStr);
									
									
									//----------------
									
									
									
									var url = "#pageHome";
									$.mobile.navigate(url);								
									
									$(".errorChk").html("Sync Successful");
									//alert('aa');
			
								}else {
									
									$("#wait_image_login").hide();
									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
				}//base url check
						
						//-------------		
					
	}//function


function chember_show(){
	//alert (localStorage.chamberStr)
	var chamberStr= localStorage.chamberStr;
	var chamberArray = chamberStr.split('<fdrd>');
	
	
	chamberStrCreate=''
	for(i=0; i < chamberArray.length-1; i++){
		
		
		var chamberStrSingle=chamberArray[i];
		
		var chambers_id=chamberStrSingle.split('fdfd')[0];
		var chamber_name=chamberStrSingle.split('fdfd')[1];

		chamberStrCreate =chamberStrCreate
		+'<input style="border-bottom-style:solid; border-color:#CBE4E4;border-bottom-width:thin" type="submit" onClick="page_chamber_go('+chambers_id+');" value="'+chamber_name +'|' +chambers_id+'">'
		+'<input id="'+chambers_id+'" name="'+chambers_id+'" type="hidden" value="'+chamber_name +'|' +chambers_id+'">'
		
	}
	
	// $("#chamber_list").html(chamberStrCreate);
	$("#chamber_list").empty();
	 $("#chamber_list").append(chamberStrCreate).trigger('create');
	 var url = "#page_chamber_show";
	 $.mobile.navigate(url);
	
}


function page_profile_show(){
	$("#error_profile_edit").html(" ");
	$("#doc_name").val(localStorage.doc_name);
	$("#doc_speciality").val(localStorage.speciality);
	$("#doc_des").val(localStorage.note);
	$("#experience").val(localStorage.experience);
	
	// alert (localStorage.speciality);
	 $("#doc_profile").html(localStorage.doc_name +'|' +localStorage.user_id);
	

	 var url = "#page_profile_show";
	$.mobile.navigate(url);
}

function page_profile_edit(){
	var doc_name=$("#doc_name").val();
	var doc_speciality=$("#doc_speciality").val();
	var doc_des=$("#doc_des").val();
	var experience=$("#experience").val();
	//alert (doc_spciality);
	doc_name=replace_special_char(doc_name);
	doc_speciality=replace_special_char(doc_speciality);
	doc_des=replace_special_char(doc_des);
	experience=replace_special_char(experience);
	
	//$("#error_profile_edit").html(apipath+'profileEdit?cid='+localStorage.user_id+'&doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&doc_name='+doc_name+'&doc_speciality='+doc_speciality+'&doc_des='+doc_des+'&experience='+experience);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'profileEdit?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&doc_name='+doc_name+'&doc_speciality='+doc_speciality+'&doc_des='+doc_des+'&experience='+experience,
					 success: function(result) {
						    //alert (result);
							if (result==''){
								//$("#wait_image_login").hide();
//								$("#loginButton").show();
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								if (result=='Success'){													

									//Profile
									localStorage.doc_name=doc_name;													
									localStorage.speciality=doc_speciality;
									localStorage.note=doc_des;
									localStorage.experience=experience;
									//alert ("nadira")								
																
									
									$("#error_profile_edit").html("Updated Successfully");
									//var url = "#pageHome";
//									$.mobile.navigate(url);	
			
								}else {
									
									$("#wait_image_login").hide();
									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	
	
}





function page_chamber_go(chambers_id){
		var chamber_show =$("#"+chambers_id).val();
		$('#chamber_id').html(chamber_show);
		
		localStorage.chamber_show=chamber_show
		
		var chamber_show=localStorage.chamber_show;
		var chamber_id=chamber_show.split('|')[1]
		localStorage.chamber_id=chamber_id
		
		//Settings, schedule and off day ready
		//$("#error_chamber_list").html(apipath+'settingsReady?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+chambers_id);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'settingsReady?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id,
					 
					 success: function(result) {											
							if (result==''){
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								var resultArray = result.split('rdrd');
								if (resultArray[0]=='Success'){													

									//Profile
									var settingsStr=resultArray[1];
									var scheduleStr=resultArray[2];
									var offdayStr=resultArray[3];
									
									localStorage.settingsStr=settingsStr;
									localStorage.scheduleStr=scheduleStr;
									localStorage.offdayStr=offdayStr;
									
									//alert (localStorage.offdayStr);						
									
									var url = "#page_chamber_go";
									$.mobile.navigate(url);
			
								}else {
									 
									//$("#wait_image_login").hide();
//									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
		
		
		
		
		
		
//		========================
		
		
		
		
		
		
	
}
function page_settings_show(){
	
	$("#error_setings_chamber").html("");
	$("#settingsChember").html(localStorage.chamber_show);
	
	var settingsStr=localStorage.settingsStr;
	var settingsArray = settingsStr.split('fdfd');
	
	//alert (settingsStr)
	row_id=settingsArray[0];
	assistant_mobile1=settingsArray[1];
	assistant_mobile2=settingsArray[2];
	visiting_duration=settingsArray[3];
	auto_serial=settingsArray[4];
	area=settingsArray[5];
	thana=settingsArray[6];
	district=settingsArray[7];
	
	
	
	//alert(assistant_mobile1)
	
	$("#row_id").val(row_id);
	$("#assistant_mobile1").val(assistant_mobile1);
	$("#assistant_mobile2").val(assistant_mobile2);
	$("#visiting_duration").val(visiting_duration);
	$("#auto_serial").val(auto_serial);
	$("#area").val(area);
	$("#thana").val(thana);
	$("#district").val(district);
	//alert("2")
	
	var url = "#page_settings_show";
	$.mobile.navigate(url);
	
}

function page_settings_edit(){
	var row_id=$("#row_id").val();
	var assistant_mobile1=$("#assistant_mobile1").val();
	var assistant_mobile2=$("#assistant_mobile2").val();
	var visiting_duration=$("#visiting_duration").val();
	var auto_serial=$("#auto_serial").val();
	var area=$("#area").val();
	var thana=$("#thana").val();
	var district=$("#district").val();
	//alert("2")
	//$("#error_setings_chamber").html(apipath+'settingsUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&assistant_mobile1='+assistant_mobile1+'&assistant_mobile2='+assistant_mobile2+'&visiting_duration='+visiting_duration+'&auto_serial='+auto_serial+'&area='+area+'&thana='+thana+'&district='+district);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'settingsUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&assistant_mobile1='+assistant_mobile1+'&assistant_mobile2='+assistant_mobile2+'&visiting_duration='+visiting_duration+'&auto_serial='+auto_serial+'&area='+area+'&thana='+thana+'&district='+district,
					 
					 success: function(result) {											
							if (result==''){
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								
								if (result=='Success'){													
									//alert ()
									var settingsStr=row_id+'fdfd'+assistant_mobile1+'fdfd'+assistant_mobile2+'fdfd'+visiting_duration+'fdfd'+auto_serial+'fdfd'+area+'fdfd'+thana+'fdfd'+district;
									localStorage.settingsStr=settingsStr;
									
									$("#error_setings_chamber").html('Settings Updated Succesfully');								
										//var url = "#page_settings_show";
										//$.mobile.navigate(url);							
									

			
								}else {
									 
									//$("#wait_image_login").hide();
//									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	

	

	
}

function page_schedule_show(){
	
	$("#error_schedule").html("");
	
	$("#scheduleChember").html(localStorage.chamber_show);
	
	var scheduleStr=localStorage.scheduleStr;
	var scheduleArray = scheduleStr.split('fdfd');
	
	
	var row_id=scheduleArray[0];
	//alert (row_id)
	var sat_mor_from=scheduleArray[1];
	var sat_mor_to=scheduleArray[2];
	var sat_eve_from=scheduleArray[3];
	var sat_eve_to=scheduleArray[4];
	var sat_max_patient=scheduleArray[5];
	
	var sun_mor_from=scheduleArray[6];
	var sun_mor_to=scheduleArray[7];
	var sun_eve_from=scheduleArray[8];
	var sun_eve_to=scheduleArray[9];
	var sun_max_patient=scheduleArray[10];
	
	var mon_mor_from=scheduleArray[11];
	var mon_mor_to=scheduleArray[12];
	var mon_eve_from=scheduleArray[13];
	var mon_eve_to=scheduleArray[14];
	var mon_max_patient=scheduleArray[15];
	
	var tue_mor_from=scheduleArray[16];
	var tue_mor_to=scheduleArray[17];
	var tue_eve_from=scheduleArray[18];
	var tue_eve_to=scheduleArray[19];
	var tue_max_patient=scheduleArray[20];
	
	var wed_mor_from=scheduleArray[21];
	var wed_mor_to=scheduleArray[22];
	var wed_eve_from=scheduleArray[23];
	var wed_eve_to=scheduleArray[24];
	var wed_max_patient=scheduleArray[25];
	
	var thu_mor_from=scheduleArray[26];
	var thu_mor_to=scheduleArray[27];
	var thu_eve_from=scheduleArray[28];
	var thu_eve_to=scheduleArray[29];
	var thu_max_patient=scheduleArray[30];
	
	var fri_mor_from=scheduleArray[31];
	var fri_mor_to=scheduleArray[32];
	var fri_eve_from=scheduleArray[33];
	var fri_eve_to=scheduleArray[34];
	var fri_max_patient=scheduleArray[35];

	
	
	
	
	$("#row_id_schedule").val(row_id);
	
	$("#sat_mor_from").val(sat_mor_from);
	$("#sat_mor_to").val(sat_mor_to);
	$("#sat_eve_from").val(sat_eve_from);
	$("#sat_eve_to").val(sat_eve_to);
	$("#sat_max_patient").val(sat_max_patient);

	$("#sun_mor_from").val(sun_mor_from);
	$("#sun_mor_to").val(sun_mor_to);
	$("#sun_eve_from").val(sun_eve_from);
	$("#sun_eve_to").val(sun_eve_to);
	$("#sun_max_patient").val(sun_max_patient);

	$("#mon_mor_from").val(mon_mor_from);
	$("#mon_mor_to").val(mon_mor_to);
	$("#mon_eve_from").val(mon_eve_from);
	$("#mon_eve_to").val(mon_eve_to);
	$("#mon_max_patient").val(mon_max_patient);
	

	$("#tue_mor_from").val(tue_mor_from);
	$("#tue_mor_to").val(tue_mor_to);
	$("#tue_eve_from").val(tue_eve_from);
	$("#tue_eve_to").val(tue_eve_to);
	$("#tue_max_patient").val(tue_max_patient);


	$("#wed_mor_from").val(wed_mor_from);
	$("#wed_mor_to").val(wed_mor_to);
	$("#wed_eve_from").val(wed_eve_from);
	$("#wed_eve_to").val(wed_eve_to);
	$("#wed_max_patient").val(wed_max_patient);


	$("#thu_mor_from").val(thu_mor_from);
	$("#thu_mor_to").val(thu_mor_to);
	$("#thu_eve_from").val(thu_eve_from);
	$("#thu_eve_to").val(thu_eve_to);
	$("#thu_max_patient").val(thu_max_patient);


	$("#fri_mor_from").val(fri_mor_from);
	$("#fri_mor_to").val(fri_mor_to);
	$("#fri_eve_from").val(fri_eve_from);
	$("#fri_eve_to").val(fri_eve_to);
	$("#fri_max_patient").val(fri_max_patient);
	//alert("2")
	
	var url = "#page_schedule_show";
	$.mobile.navigate(url);
	
}
function page_schedule_edit(){
	var row_id=$("#row_id_schedule").val();
	
	var sat_mor_from=$("#sat_mor_from").val();
	var sat_mor_to=$("#sat_mor_to").val();
	var sat_eve_from=$("#sat_eve_from").val();
	var sat_eve_to=$("#sat_eve_to").val();
	var sat_max_patient=$("#sat_max_patient").val();

	var sun_mor_from=$("#sun_mor_from").val();
	var sun_mor_to=$("#sun_mor_to").val();
	var sun_eve_from=$("#sun_eve_from").val();
	var sun_eve_to=$("#sun_eve_to").val();
	var sun_max_patient=$("#sun_max_patient").val();

	var mon_mor_from=$("#mon_mor_from").val();
	var mon_mor_to=$("#mon_mor_to").val();
	var mon_eve_from=$("#mon_eve_from").val();
	var mon_eve_to=$("#mon_eve_to").val();
	var mon_max_patient=$("#mon_max_patient").val();
	

	var tue_mor_from=$("#tue_mor_from").val();
	var tue_mor_to=$("#tue_mor_to").val();
	var tue_eve_from=$("#tue_eve_from").val();
	var tue_eve_to=$("#tue_eve_to").val();
	var tue_max_patient=$("#tue_max_patient").val();


	var wed_mor_from=$("#wed_mor_from").val();
	var wed_mor_to=$("#wed_mor_to").val();
	var wed_eve_from=$("#wed_eve_from").val();
	var wed_eve_to=$("#wed_eve_to").val();
	var wed_max_patient=$("#wed_max_patient").val();


	var thu_mor_from=$("#thu_mor_from").val();
	var thu_mor_to=$("#thu_mor_to").val();
	var thu_eve_from=$("#thu_eve_from").val();
	var thu_eve_to=$("#thu_eve_to").val();
	var thu_max_patient=$("#thu_max_patient").val();


	var fri_mor_from=$("#fri_mor_from").val();
	var fri_mor_to=$("#fri_mor_to").val();
	var fri_eve_from=$("#fri_eve_from").val();
	var fri_eve_to=$("#fri_eve_to").val();
	var fri_max_patient=$("#fri_max_patient").val();
	
	var submit_string=row_id+'fdfd'+sat_mor_from+'fdfd'+sat_mor_to+'fdfd'+sat_eve_from+'fdfd'+sat_eve_to+'fdfd'+sat_max_patient
            +'fdfd'+sun_mor_from+'fdfd'+sun_mor_to+'fdfd'+sun_eve_from+'fdfd'+sun_eve_to+'fdfd'+sun_max_patient
            +'fdfd'+mon_mor_from+'fdfd'+mon_mor_to+'fdfd'+mon_eve_from+'fdfd'+mon_eve_to+'fdfd'+mon_max_patient
            +'fdfd'+tue_mor_from+'fdfd'+tue_mor_to+'fdfd'+tue_eve_from+'fdfd'+tue_eve_to+'fdfd'+tue_max_patient
             +'fdfd'+wed_mor_from+'fdfd'+wed_mor_to+'fdfd'+wed_eve_from+'fdfd'+wed_eve_to+'fdfd'+wed_max_patient
            +'fdfd'+thu_mor_from+'fdfd'+thu_mor_to+'fdfd'+thu_eve_from+'fdfd'+thu_eve_to+'fdfd'+thu_max_patient
            +'fdfd'+fri_mor_from+'fdfd'+fri_mor_to+'fdfd'+fri_eve_from+'fdfd'+fri_eve_to+'fdfd'+fri_max_patient
	//alert(submit_string)
//	$("#error_schedule").html(apipath+'scheduleUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&submit_string='+submit_string);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'scheduleUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&submit_string='+submit_string,
					 
					 success: function(result) {											
							if (result==''){
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								
								if (result=='Success'){													
									//alert ()
									var settingsStr=row_id+'fdfd'+assistant_mobile1+'fdfd'+assistant_mobile2+'fdfd'+visiting_duration+'fdfd'+auto_serial+'fdfd'+area+'fdfd'+thana+'fdfd'+district;
									localStorage.scheduleStr=submit_string;
									
									$("#error_schedule").html('Schedule Updated Succesfully');								
										//var url = "#page_settings_show";
										//$.mobile.navigate(url);							
									

			
								}else {
									 
									//$("#wait_image_login").hide();
//									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	

	

	
}


function page_OffDay_show(){
	$("#error_offday").html("");
	
	$("#offdayChember").html(localStorage.chamber_show);
	
	var offdayStr=localStorage.offdayStr;
	var offdayStrArray = offdayStr.split('fdrd');

	offdayStr_create='<table  border="0" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%; border-bottom:solid; border-bottom-color:#999; font-size:70%;">'
	for(i=0; i < offdayStrArray.length-1; i++){
		var offdayStrSingle=offdayStrArray[i];
		//alert (offdayStrSingle);
		var row_id_off=offdayStrSingle.split('fdfd')[0];
		var off_day=offdayStrSingle.split('fdfd')[1];	
		offdayStr_create=offdayStr_create+' <tr ><td style="width:30%;" >'+off_day+'</td><td style="width:20%;" ><input onClick="deleteOffday('+row_id_off+');"  value=" X " type="Submit"></td>'+'</tr>'
		
	}
	offdayStr_create=offdayStr_create+'</table>'

	$("#offday").html(offdayStr_create);
	var url = "#page_OffDay_show";
	$.mobile.navigate(url);
	
}

function deleteOffday(row_id_off){
	//var chamber_show=localStorage.chamber_show;
//	var chamber_id=chamber_show.split('|')[1]
	
	//$("#error_offday").html(apipath+'deleteOffday?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id_off='+row_id_off+'&chamber_id='+chamber_id);
										
	$.ajax({
			 type: 'POST',
			 url: apipath+'deleteOffday?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id_off='+row_id_off+'&chamber_id='+localStorage.chamber_id,
			 
			 success: function(result) {											
					if (result==''){
						$("#error_profile_edit").html('Sorry Network not available');
						
					}else{
						
						if (result.split('rdrd')[0]=='Success'){													
							
							localStorage.offdayStr=result.split('rdrd')[1]
							page_OffDay_show();
							$("#error_schedule").html('Updated Succesfully');								
						}else {
							 
							//$("#wait_image_login").hide();
//									$("#loginButton").show();
							//$("#error_login").html('Server Error');													
							
							$("#error_login").html("Authorization or Network Error.");
							//$('#syncBasic').show();
						}
											
						
					}
				  },
			  error: function(result) {					 
				  $("#wait_image_login").hide();
				  $("#loginButton").show();
				//  $("#error_login").html('Invalid Request');
				  
				  var url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
}
function addOffday(){
	//var chamber_show=localStorage.chamber_show;
//	var chamber_id=chamber_show.split('|')[1]
	
	
	var off_date=$("#off_date").val();
	
	//$("#error_offday").html(apipath+'addOffday?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&off_date='+off_date+'&chamber_id='+chamber_id);
	if (off_date.length==10){									
		$.ajax({
				 type: 'POST',
				 url: apipath+'addOffday?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&off_date='+off_date+'&chamber_id='+localStorage.chamber_id,
				 
				 success: function(result) {											
						if (result==''){
							$("#error_offday").html('Sorry Network not available');
							
						}else{
							 
							if (result.split('rdrd')[0]=='Success'){													
								
								localStorage.offdayStr=result.split('rdrd')[1]
								page_OffDay_show();
								//alert ('zfdsg')
								$("#error_offday").html('Added Succesfully');								
							}else {
								 
								//$("#wait_image_login").hide();
	//									$("#loginButton").show();
								//$("#error_login").html('Server Error');													
								
								$("#error_offday").html("Sync Failed. Authorization or Network Error.");
								//$('#syncBasic').show();
							}
												
							
						}
					  },
				  error: function(result) {					 
					  $("#wait_image_login").hide();
					  $("#loginButton").show();
					//  $("#error_login").html('Invalid Request');
					  
					  var url = "#login";
					  $.mobile.navigate(url);	
				  }
			  });//end ajax
	}
	else{
		$("#error_offday").html("Invalid Date");
	}
	
}




function page_chember_req_show(){
	
	//var chamber_show=localStorage.chamber_show
//	var chamber_showArray = chamber_show.split('|');
//	
//	var chamber_id=chamber_showArray[1];
	
	//$("#error_request_show").html(apipath+'requestShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+chamber_id);
			$("#reqChember").html('');							
			$.ajax({
					 type: 'POST',
					 url: apipath+'requestShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id,
					 
					 success: function(result) {											
							if (result==''){
								$("#reqChember").html('Sorry Network not available');
								
							}else{
								var resultArray = result.split('rdrd');
								if (resultArray[0]=='Success'){													

									//Profile
									var reqStr=resultArray[1];													
									
									var reqStrArray = reqStr.split('<fdrd>');
									
									
									var reqStrFull='<table  border="0" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%; border-bottom:solid; border-bottom-color:#999; font-size:70%;">'
									//alert (reqStrArray.length)
									
									for(i=0; i < reqStrArray.length-1; i++){
										
										var reqStrSingle=reqStrArray[i];
										
										var reqStrSingleArray = reqStrSingle.split('fdfd');
										
										var row_id=reqStrSingleArray[0];
										var patinet_name=reqStrSingleArray[1];
										var patinet_mobile=reqStrSingleArray[2];
										var app_time=reqStrSingleArray[3];
										var status=reqStrSingleArray[4];
            							
										var apptime_date=row_id+'date'
										var apptime_time=row_id+'time'
										
										
										var date_get="";
										var time_get="";
										if (app_time.length > 10){
											var date_get=app_time.split(' ')[0]
											var time_get=app_time.split(' ')[1]
										}
										// alert (row_id)
										
										reqStrFull = reqStrFull+'<tr ><td style="width:50%;" ><strong style="font-size:18px; color:#008040">'+patinet_name+'</strong></td>'
													+'<td  ><input width="80px" id="'+ apptime_date +'" name="'+ apptime_date+'" type="date" value="'+date_get+'"></td>'
													+'<td  ><input width="80px" id="'+ apptime_time +'" name="'+ apptime_time+'" type="time" value="'+time_get+'"></td>'
												  if (status == 'SUBMITED'){ 
												   
												   reqStrFull = reqStrFull + '<td style="width:50%;" ><input type="submit" onClick="confirm_app('+ row_id+');" value=" Confirm "></td>'
												  }
												  else{
													reqStrFull = reqStrFull +'<td style="width:50%;" ><input type="submit" value=" '+status+' " disabled="disabled" ></td>' 
													  }
													reqStrFull = reqStrFull+'</tr>'  
													  
									  
										}
							        
									
									reqStrFull = reqStrFull + '</table>'
									
									//alert (localStorage.reqStrFull);
									localStorage.reqStrFull=reqStrFull;
									
									//$("#reqList").html(localStorage.reqStrFull);	
									
									$("#reqChember").html(localStorage.chamber_show);	
									$("#reqList").empty();
									$("#reqList").append(localStorage.reqStrFull).trigger('create');
									var url = "#page_request_show";
									$.mobile.navigate(url);								
									

			
								}else {
									 
									//$("#wait_image_login").hide();
//									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	    var url = "#page_request_show";
		$.mobile.navigate(url);
	
}
function req_show(){
	
	$("#reqChember").html(localStorage.chamber_show);
	
	var reqStr=localStorage.reqStrFull;													
	var reqStrArray = reqStr.split('<fdrd>');
	var reqStrFull='<table  border="0" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%; border-bottom:solid; border-bottom-color:#999; font-size:70%;">'
	//$("#error_request").text(localStorage.reqStrFull);
	//alert (reqStrArray.length);
	for(i=0; i < reqStrArray.length-1; i++){
		//alert ("asas");
		var reqStrSingle=reqStrArray[i];
		var reqStrSingleArray = reqStrSingle.split('fdfd');
		
		var row_id=reqStrSingleArray[0];
		var patinet_name=reqStrSingleArray[1];
		var patinet_mobile=reqStrSingleArray[2];
		var app_time=reqStrSingleArray[3];
		var status=reqStrSingleArray[4];
		
		var apptime_date=row_id+'date'
		var apptime_time=row_id+'time'
		
		
		var date_get="";
		var time_get="";
		if (app_time.length > 10){
			var date_get=app_time.split(' ')[0]
			var time_get=app_time.split(' ')[1]
		}
		// alert (row_id)
		
		reqStrFull = reqStrFull+'<tr ><td style="width:50%;" ><strong style="font-size:18px; color:#008040">'+patinet_name+'</strong></td>'
					+'<td  ><input width="80px" id="'+ apptime_date +'" name="'+ apptime_date+'" type="date" value="'+date_get+'"></td>'
					+'<td  ><input width="80px" id="'+ apptime_time +'" name="'+ apptime_time+'" type="time" value="'+time_get+'"></td>'
				  if (status == 'SUBMITED'){ 
				   
				   reqStrFull = reqStrFull + '<td style="width:50%;" ><input type="submit" onClick="confirm_app('+ row_id+');" value=" Confirm "></td>'
				  }
				  else{
					reqStrFull = reqStrFull +'<td style="width:50%;" ><input type="submit" value=" '+status+' " disabled="disabled" ></td>' 
					  }
					reqStrFull = reqStrFull+'</tr>'  
					  
	  
		}
	
	
	reqStrFull = reqStrFull + '</table>'
	
	//alert (localStorage.reqStrFull);
	localStorage.reqStrFull=reqStrFull;	
	$("#reqList").empty();
	$("#reqList").append(localStorage.reqStrFull).trigger('create');
	var url = "#page_request_show";
	$.mobile.navigate(url);			
	
}

function confirm_app(row_id){
	//var chamber_show=localStorage.chamber_show;
//	var chamber_id=chamber_show.split('|')[1]
	
	
	
	
	//$("#error_request").html(apipath+'confirm_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&chamber_id='+localStorage.chamber_id);
										
	$.ajax({
			 type: 'POST',
			 url: apipath+'confirm_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&chamber_id='+localStorage.chamber_id,
			 
			 success: function(result) {											
					if (result==''){
						$("#error_profile_edit").html('Sorry Network not available');
						
					}else{
						 
						if (result.split('rdrd')[0]=='Success'){													
							
							localStorage.reqStrFull=result.split('rdrd')[1]
							page_chember_req_show();

							$("#error_request").html('Confirmed Succesfully');	
							
							 //var url = "#page_request_show";
//							 $.mobile.navigate(url);
						}else {
							 
							//$("#wait_image_login").hide();
//									$("#loginButton").show();
							//$("#error_login").html('Server Error');													
							
							$("#error_request").html("Sync Failed. Authorization or Network Error.");
							//$('#syncBasic').show();
						}
											
						
					}
				  },
			  error: function(result) {					 
				  $("#wait_image_login").hide();
				  $("#loginButton").show();
				//  $("#error_login").html('Invalid Request');
				//  alert ("sdfdsg")
				  var url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
}





function req_app_search(){
	//var chamber_show=localStorage.chamber_show
//	var chamber_showArray = chamber_show.split('|');
//	
//	var chamber_id=chamber_showArray[1];
	

	
	
	var req_search=$("#req_search").val()
	
	
	//$("#error_request").html(apipath+'search_req_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&req_search='+req_search+'&chamber_id='+localStorage.chamber_id);
										
	$.ajax({
			 type: 'POST',
			 url: apipath+'search_req_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&req_search='+req_search+'&chamber_id='+localStorage.chamber_id,
			 
			 success: function(result) {											
					if (result==''){
						$("#error_request").html('Sorry Network not available');
						
					}else{
						 
						if (result.split('rdrd')[0]=='Success'){													
							
							localStorage.reqStrFull=result.split('rdrd')[1]
							
							//alert (localStorage.chamber_show);
							req_show();

							//$("#error_request").html('Confirmed Succesfully');	
							
							 //var url = "#page_request_show";
//							 $.mobile.navigate(url);
						}else {
							 
							//$("#wait_image_login").hide();
//									$("#loginButton").show();
							$("#error_request").html('Appoinment not Available.');													
							
						//	$("#error_request").html(result.split('rdrd')[0]);
							//$('#syncBasic').show();
						}
											
						
					}
				  },
			  error: function(result) {					 
				  $("#wait_image_login").hide();
				  $("#loginButton").show();
				//  $("#error_login").html('Invalid Request');
				//  alert ("sdfdsg")
				  var url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
}


function page_con_appoinment_show(){
	
	$("#reqConChember").html(localStorage.chamber_show);
	
	//$("#error_request_show").html(apipath+'confirmedShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'confirmedShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id,
					 
					 success: function(result) {											
							if (result==''){
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								var resultArray = result.split('rdrd');
								if (resultArray[0]=='Success'){													

									//Profile
									var reqStr=resultArray[1];													
									
									var reqStrArray = reqStr.split('<fdrd>');
									
									
									var reqConStrFull='<table  border="0" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%; border-bottom:solid; border-bottom-color:#999; font-size:70%;">'
									//alert (reqStrArray.length)
									
									for(i=0; i < reqStrArray.length-1; i++){
										
										var reqStrSingle=reqStrArray[i];
										
										var reqStrSingleArray = reqStrSingle.split('fdfd');
										
										var row_id=reqStrSingleArray[0];
										var patinet_name=reqStrSingleArray[1];
										var patinet_mobile=reqStrSingleArray[2];
										var app_time=reqStrSingleArray[3];
            							
										var apptime_text=row_id+'time'
										
										reqConStrFull = reqConStrFull+'<tr ><td style="width:50%;" ><strong style="font-size:18px; color:#008040">'+patinet_name+'</strong></td>'
													+'<td style="width:50%;" >  '+app_time +' </td>'
												    +'<td style="width:50%;" ><input type="button" onClick="cancel_app('+row_id+');" value=" Cancel " ></td></tr>'
								
									}
							        reqConStrFull = reqConStrFull + '</table>'
									localStorage.reqConStrFull=reqConStrFull;
									
									
									$("#reqConList").empty();
									$("#reqConList").append(localStorage.reqConStrFull).trigger('create');
																
									var url = "#page_con_appoinment_show";
									$.mobile.navigate(url);								
									

			
								}else {
									 
									//$("#wait_image_login").hide();
//									$("#loginButton").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  var url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	    var url = "#page_con_appoinment_show";
		$.mobile.navigate(url);
	
}
function cancel_app(row_id){
	//var chamber_show=localStorage.chamber_show;
//	var chamber_id=chamber_show.split('|')[1]
	
	
	
	
	$("#error_con_list").html(apipath+'cancel_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&chamber_id='+localStorage.chamber_id);
										
	$.ajax({
			 type: 'POST',
			 url: apipath+'cancel_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&chamber_id='+localStorage.chamber_id,
			 
			 success: function(result) {											
					if (result==''){
						$("#error_profile_edit").html('Sorry Network not available');
						
					}else{
						 
						if (result.split('rdrd')[0]=='Success'){													
							
							localStorage.reqConStrFull=result.split('rdrd')[1]
							req_con_show();

							$("#error_request").html('Cancelled Succesfully');	
							
							 //var url = "#page_request_show";
//							 $.mobile.navigate(url);
						}else {
							 
							//$("#wait_image_login").hide();
//									$("#loginButton").show();
							//$("#error_login").html('Server Error');													
							
							$("#error_request").html("Sync Failed. Authorization or Network Error.");
							//$('#syncBasic').show();
						}
											
						
					}
				  },
			  error: function(result) {					 
				  $("#wait_image_login").hide();
				  $("#loginButton").show();
				//  $("#error_login").html('Invalid Request');
				//  alert ("sdfdsg")
				  var url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
}

function req_con_show(){
	
	$("#reqChember").html(localStorage.chamber_show);
	//alert ()
	var reqConStrFull=localStorage.reqConStrFull;													
	var reqStrArray = reqConStrFull.split('<fdrd>');
	var reqConStrFull='<table  border="0" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%; border-bottom:solid; border-bottom-color:#999; font-size:70%;">'
	//$("#error_request").text(localStorage.reqStrFull);
	//alert (reqStrArray.length);
	for(i=0; i < reqStrArray.length-1; i++){
		//alert ("asas");
		var reqStrSingle=reqStrArray[i];
		var reqStrSingleArray = reqStrSingle.split('fdfd');
		
		var row_id=reqStrSingleArray[0];
		var patinet_name=reqStrSingleArray[1];
		var patinet_mobile=reqStrSingleArray[2];
		var app_time=reqStrSingleArray[3];
		var status=reqStrSingleArray[4];
		
		var apptime_text=row_id
		
		// alert (row_id)
		
		reqConStrFull = reqConStrFull+'<tr ><td style="width:50%;" ><strong style="font-size:18px; color:#008040">'+patinet_name+'</strong></td>'
													+'<td style="width:50%;" >  '+app_time +' </td>'
												    +'<td style="width:50%;" ><input type="button" onClick="cancel_app();" value=" Cancel " ></td></tr>'
					  
	  
		}
	
	
	reqConStrFull = reqConStrFull + '</table>'
	
	//alert (localStorage.reqStrFull);
	localStorage.reqConStrFull=reqConStrFull;	
	$("#reqConList").empty();
	$("#reqConList").append(localStorage.reqConStrFull).trigger('create');
	var url = "#page_con_appoinment_show";
	$.mobile.navigate(url);			
	
}




//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}







