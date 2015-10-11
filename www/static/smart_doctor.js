
//online
var apipath="http://eapps001.cloudapp.net/smart_doctor/syncmobile/";

//local
//var apipath="http://127.0.0.1:8000/smart_doctor/syncmobile/";


var latitude="";
var longitude="";

var url = "";

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
		
		$("#add_new_chamber").hide();	

			$("#q_lat").val("");
			$("#q_long").val("");
			$("#wait_image_login").hide();
			
		//alert (localStorage.sync_code)
		if ((localStorage.sync_code == "undefined") || (localStorage.sync_code == undefined)){
			url = "#login";
			$.mobile.navigate(url);
		}
		else{
			url = "#pageHome";
			$.mobile.navigate(url);
		}
		
		//alert  (localStorage.sync_code)
		
		
	});

function menuClick(){
	
	url = "#pageHome";
	$.mobile.navigate(url);
	
}



function get_login() {
	url = "#login";
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
		url = "#login";      
		$.mobile.navigate(url);
		$("#error_login").html('Required User ID and PIN <br> '+'<font style="color:#0072A8">For UserID and PIN Code  <br> <font style="font-size:20px"> sms  <font style=" font-weight:bold">SD </font> to <font style=" font-weight:bold">2765 </font> </font> </font>');	
	}else{
		//-----------------
			$("#wait_image_login").show();
			$("#loginButton").hide();
									
			if(localStorage.sync_code==undefined || localStorage.sync_code==""){
				localStorage.sync_code=0
			}
			
		//	$("#error_login").html(apipath+'passwordCheck?doc_id='+user_id+'&password='+encodeURIComponent(user_pass)+'&sync_code='+localStorage.sync_code);
			//							
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
									
									localStorage.specialityStr=syncResultArray[4];
									localStorage.areaStr=syncResultArray[5];
									
									localStorage.doctorProfileFlagOk=syncResultArray[6];
									
									//alert (localStorage.doctorProfileFlagOk)
									
									//alert (localStorage.areaStr)
									//Profile
									//alert (docProfileStr)
									var profileArray = docProfileStr.split('fdfd');
									localStorage.doc_name=profileArray[0];														
									localStorage.speciality=profileArray[1];
									localStorage.note=profileArray[2];
									localStorage.experience=profileArray[3];
									
									
									
									
									localStorage.user_id=user_id;
									localStorage.user_pass=user_pass

									
									//----------------
									if ((localStorage.doc_name=='') || (localStorage.speciality=='')){
										page_profile_show();
									}
									else{
										$("#error_login").html('Sorry Network not available');
										url = "#pageHome";
										$.mobile.navigate(url);	
									}
									
									$("#wait_image_login").hide();
									$("#loginButton").show();							
									
									$("#error_login").html("Synced Successfully");
			
								}else {
									
									$("#wait_image_login").hide();
									$("#loginButton").show();
									
									$("#error_login").html('Sync Failed. Invalid UserID or PIN'+'<br><font style="color:#0072A8">For UserID and PIN Code  <br> <font style="font-size:20px"> sms  <font style=" font-weight:bold">SD </font> to <font style=" font-weight:bold">2765 </font> </font> </font>');
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						  $("#error_login").html('Connection Timeout.'+'<br><font style="color:#0072A8">Please check you have active Internet Connection. </font>')
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
				}//base url check
						
						//-------------		
					
	}//function


function chember_show(){
	if (localStorage.doctorProfileFlagOk==1){	
		var chamberStr= localStorage.chamberStr;
		var chamberArray = chamberStr.split('<fdrd>');
		$("#chamber_list").show();
		$("#wait_image_chamber").hide();
		
		$("#all_button").show();
		$("#wait_image_chamber_info").hide();
		
		
		
		
		
		
		chamberStrCreate=''
		for(i=0; i < chamberArray.length-1; i++){
			
			
			var chamberStrSingle=chamberArray[i];
			
			var chambers_id=chamberStrSingle.split('fdfd')[0];
			var chamber_name=chamberStrSingle.split('fdfd')[1];
			var address=chamberStrSingle.split('fdfd')[2];
			
			//alert (address)
			chamberStrCreate =chamberStrCreate
			+'<input style="border-bottom-style:solid; border-color:#CBE4E4;border-bottom-width:thin" type="submit" onClick="page_chamber_go('+chambers_id+');" value="'+chamber_name +'|' +chambers_id+'">'
			+'<input id="'+chambers_id+'" name="'+chambers_id+'" type="hidden" value="'+chamber_name +' | ' +chambers_id +'<br>' + address+ '">'
			
		}
		
		//alert (chamberStrCreate);
		if ((localStorage.doc_name=='') || (localStorage.speciality=='')){
			page_profile_show();
		}
		else{
			 
			  $("#error_chamber_list").html('');
			 $("#chamber_list").empty();
			 $("#chamber_list").append(chamberStrCreate).trigger('create');
			 url = "#page_chamber_show";
			 $.mobile.navigate(url);
		}
	}//end if profile data
	else{
		 $("#error_home").html('Please first complete Profile Information.');
		 url = "#pageHome";
		 $.mobile.navigate(url);
	}
	
	
}


function page_profile_show(){
	$("#error_profile_edit").html(" ");
	$("#wait_image_profile").hide();
	$("#profile_edit").show();
	
	
	
	$("#doc_name").val(localStorage.doc_name);
	//$("#doc_speciality").val(localStorage.speciality);
	$("#doc_des").val(localStorage.note);
	$("#experience").val(localStorage.experience);
	
	
	if ((localStorage.doc_name=="") & (localStorage.experience==0)){
		$("#experience").val("");
	}
	//alert (localStorage.speciality)
	var speciality_show=localStorage.specialityStr;
	var doc_speciality='<select name="doc_speciality" id="doc_speciality" >'
	doc_speciality= doc_speciality+'<option  value="'+localStorage.speciality+'">'+localStorage.speciality+'</option>'
                   
	var specialityStrArray=speciality_show.split('fdfd')
	
	
	for(i=0; i < specialityStrArray.length-1; i++){
		
		doc_speciality= doc_speciality+'<option  value="'+specialityStrArray[i]+'">'+specialityStrArray[i]+'</option>'
		
		
	}
	doc_speciality=doc_speciality+'</select>'
	
	
	
	$("#spciality_combo").empty();
	$("#spciality_combo").append(doc_speciality).trigger('create');
	
	
	// alert (doc_speciality);
	 $("#doc_profile").html(localStorage.doc_name +'|' +localStorage.user_id);
	

	 url = "#page_profile_show";
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
	
	$("#wait_image_profile").show();
	$("#profile_edit").hide();
	
	if  ((doc_name !='') & (doc_speciality !='') & (doc_des !='') & (experience !='')){
		localStorage.doctorProfileFlagOk=1
	}
	else{
		localStorage.doctorProfileFlagOk=0
		$("#error_profile_edit").html("Please complete all required information.");
		$("#wait_image_profile").hide();
		$("#profile_edit").show();
	}
	
	
	if (localStorage.doctorProfileFlagOk==1){	
	//$("#error_profile_edit").html(apipath+'profileEdit?cid='+localStorage.user_id+'&doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&doc_name='+doc_name+'&doc_speciality='+doc_speciality+'&doc_des='+doc_des+'&experience='+experience);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'profileEdit?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&doc_name='+doc_name+'&doc_speciality='+doc_speciality+'&doc_des='+doc_des+'&experience='+experience,
					 success: function(result) {
						    //alert (result);
							if (result==''){
								$("#wait_image_profile").hide();
								$("#profile_edit").show()
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
									$("#wait_image_profile").hide();
									$("#profile_edit").show();
									//url = "#pageHome";
//									$.mobile.navigate(url);	
			
								}else {
									
									$("#wait_image_profile").hide();
									$("#profile_edit").show();
									//$("#error_login").html('Server Error');													
									
									$("#error_profile_edit").html("Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_profile").hide();
						  $("#profile_edit").show();
						//  $("#error_login").html('Invalid Request');
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	}
	
}





function page_chamber_go(chambers_id){
		var chamber_show =$("#"+chambers_id).val();
		$('#chamber_id').html(chamber_show);
		
		//localStorage.chamber_show=chamber_show
//		var chamber_show=localStorage.chamber_show;
		var chamber_id_get=chamber_show.split('<br>')[0]
		var chamber_id=chamber_id_get.split(' | ')[1]
		var chamber_name=chamber_id_get.split(' | ')[0]
		localStorage.chamber_id=chamber_id
		localStorage.chamber_name=chamber_name
		
		
		chamber_show=localStorage.doc_name+'<br>'+localStorage.chamber_name+'<br>'+chamber_show.split('<br>')[1]+'<br>'+'ChamberCode: '+localStorage.user_id+localStorage.chamber_id
		localStorage.chamber_show=chamber_show
		
		
		//alert (chamber_show)
		
		$("#chamber_list").hide();
		$("#wait_image_chamber").show();
		
		$("#new_chamber_add").hide();
		
		
		//Settings, schedule and off day ready
	//	$("#error_chamber_list").html(apipath+'settingsReady?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+chambers_id);
										
			$.ajax({
					 type: 'POST',
					 url:apipath+'settingsReady?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+chambers_id,
					
					 success: function(result) {
						 // alert (result)
							if (result==''){
								$("#chamber_list").show();
								$("#wait_image_chamber").hide();
								$("#new_chamber_add").show();
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								var resultArray = result.split('rdrd');
								//alert (result);
								if (resultArray[0]=='Success'){													
									
									
									
									
									//Profile
									var settingsStr=resultArray[1];
									var scheduleStr=resultArray[2];
									var offdayStr=resultArray[3];
									
									localStorage.settingsStr=settingsStr;
									localStorage.scheduleStr=scheduleStr;
									localStorage.offdayStr=offdayStr;
									

									$("#chamber_list").show();
									$("#wait_image_chamber").hide();
									$("#new_chamber_add").show();
									
									$("#chamber_id_all").html(localStorage.chamber_show);
									
									url = "#page_chamber_go";
									$.mobile.navigate(url);

									
			
								}else {
									 
									$("#chamber_list").show();
									$("#wait_image_chamber").hide();	
									$("#new_chamber_add").show();
									
									$("#error_chamber_list").html("Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#chamber_list").show();
						  $("#wait_image_chamber").hide();
						  $("#new_chamber_add").show();
						//  $("#error_login").html('Invalid Request');
						
						
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
		
		
		
		
		
		
//		========================
		
		
		
		
		
		
	
}
function page_settings_show(){
	$("#error_setings_chamber_1").html("");
	$("#error_setings_chamber").html("");
	$("#settingsChember").html(localStorage.chamber_show);
	
	$("#btnSettings").show();
	$("#wait_image_setting_edit").hide();
	
	$("#all_button").hide();
	$("#wait_image_chamber_info").show();
	
	
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
	$("#chamber_name_old").val(localStorage.chamber_name);
	
	$("#assistant_mobile1").val(assistant_mobile1);
	$("#assistant_mobile2").val(assistant_mobile2);
	$("#visiting_duration").val(visiting_duration);
	$("#auto_serial").val(auto_serial);
	$("#area").val(area);
	//$("#thana").val(thana);
	//$("#district").val(district);
	//alert("2")
	
	
	
	
	var area_show=localStorage.areaStr;
	var doc_area='<select name="area" id="area" >'
	doc_area= doc_area+'<option  value="'+area +" | "+district+'">'+area +" | "+district+'</option>'
                   
	var areaStrArray=area_show.split('fdfd')
	
	
	for(i=0; i < areaStrArray.length-1; i++){
		
		doc_area= doc_area+'<option  value="'+areaStrArray[i]+'">'+areaStrArray[i]+'</option>'
		
		
	}
	doc_area=doc_area+'</select>'
	
	
	
	$("#area_combo").empty();
	$("#area_combo").append(doc_area).trigger('create');
	
	
	
	$("#all_button").show();
	$("#wait_image_chamber_info").hide();
	
	url = "#page_settings_show";
	$.mobile.navigate(url);
	
}

function page_settings_edit(){
	var row_id=$("#row_id").val();
	var chamber_name=$("#chamber_name_old").val();
	var assistant_mobile1=$("#assistant_mobile1").val();
	var assistant_mobile2=$("#assistant_mobile2").val();
	var visiting_duration=$("#visiting_duration").val();
	var auto_serial=$("#auto_serial").val();
	var areaDistrict=$("#area").val();
	//var thana=$("#thana").val();
//	var district=$("#district").val();
	var blockedSL=$("#blockedSL").val();
	var address=$("#address").val();
	
	
	
	var thana="";
	var area=areaDistrict.split('|')[1]
	var district=areaDistrict.split('|')[0]
	
	
	
	//alert (areaDistrict.length)
	if (areaDistrict.length > 3){
		$("#btnSettings").hide();
		$("#wait_image_setting_edit").show();
	//alert("2")
//	$("#error_setings_chamber_1").html(apipath+'settingsUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&assistant_mobile1='+assistant_mobile1+'&assistant_mobile2='+assistant_mobile2+'&visiting_duration='+visiting_duration+'&auto_serial='+auto_serial+'&area='+area+'&thana='+thana+'&district='+district+'&blockedSL='+blockedSL+'&address='+address+'&chamber_name='+chamber_name);
									
			$.ajax({
					 type: 'POST',
					 url: apipath+'settingsUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&assistant_mobile1='+assistant_mobile1+'&assistant_mobile2='+assistant_mobile2+'&visiting_duration='+visiting_duration+'&auto_serial='+auto_serial+'&area='+area+'&thana='+thana+'&district='+district+'&blockedSL='+blockedSL+'&address='+address+'&chamber_name='+chamber_name,
					 
					 success: function(result) {	
					// alert (result);	
							if (result==''){
								$("#btnSettings").show();
								$("#wait_image_setting_edit").hide();
								$("#error_setings_chamber_1").html('Sorry Network not available');
								
							}else{
								
								if (result=='Success'){													
									
									var settingsStr=row_id+'fdfd'+assistant_mobile1+'fdfd'+assistant_mobile2+'fdfd'+visiting_duration+'fdfd'+auto_serial+'fdfd'+area+'fdfd'+thana+'fdfd'+district;
									localStorage.settingsStr=settingsStr;
									
									$("#error_setings_chamber_1").html('Settings Updated Succesfully');	
									$("#btnSettings").show();
									$("#wait_image_setting_edit").hide();
									
									//alert ('asfsdf')

			
								}else {
									 
									$("#btnSettings").show();
									$("#wait_image_setting_edit").hide();												
									
									$("#error_setings_chamber_1").html("Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	}//end if
	else{
		 
		
		$("#error_setings_chamber").html("Please Select Area.");
	}
	

	
}

function page_schedule_show(){
	$("#btnScheduleEdit").show();
	$("#wait_image_sch_edit").hide();
	
	
	
	$("#all_button").hide();
	$("#wait_image_chamber_info").show();
	
	
	
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
	
	$("#all_button").show();
	$("#wait_image_chamber_info").hide();
	
	url = "#page_schedule_show";
	$.mobile.navigate(url);
	
}
function page_schedule_edit(){
	$("#btnScheduleEdit").hide();
	$("#wait_image_sch_edit").show();
	
	
	
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
	//$("#error_schedule").html(apipath+'scheduleUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&submit_string='+submit_string);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'scheduleUpdate?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&submit_string='+submit_string,
					 
					 success: function(result) {											
							if (result==''){
								$("#btnScheduleEdit").show();
								$("#wait_image_sch_edit").hide();
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								
								if (result=='Success'){													
									//alert (result)
									//var settingsStr=row_id+'fdfd'+assistant_mobile1+'fdfd'+assistant_mobile2+'fdfd'+visiting_duration+'fdfd'+auto_serial+'fdfd'+area+'fdfd'+thana+'fdfd'+district;
								//	alert ("NN")
									localStorage.scheduleStr=submit_string;
									
									$("#error_schedule").html('Schedule Updated Succesfully');								
									
									$("#btnScheduleEdit").show();
									$("#wait_image_sch_edit").hide();
									
									
			
								}else {
									 
									$("#btnScheduleEdit").show();
									$("#wait_image_sch_edit").hide();													
									
									$("#error_schedule").html("Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#btnScheduleEdit").show();
						  $("#wait_image_sch_edit").hide();
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	

	

	
}


function page_OffDay_show(){
	$("#error_offday").html("");
	
	
	$("#all_button").hide();
	$("#wait_image_chamber_info").show();
	
	
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

	//$("#offday").html(offdayStr_create);
	$("#offday").empty();
	$("#offday").append(offdayStr_create).trigger('create');
	
	$("#all_button").show();
	$("#wait_image_chamber_info").hide();
	
	url = "#page_OffDay_show";
	$.mobile.navigate(url);
	
}

function deleteOffday(row_id_off){

	
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
				  
				  url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
}
function addOffday(){	
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
					  
					  url = "#login";
					  $.mobile.navigate(url);	
				  }
			  });//end ajax
	}
	else{
		$("#error_offday").html("Invalid Date");
	}
	
}




function page_chember_req_show(){	//$("#error_request_show").html(apipath+'requestShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+chamber_id);
			$("#all_button").hide();
			$("#wait_image_chamber_info").show();
			
			
			
			//alert ('ttttt')
			
			
			
			
			
			
			$("#error_request").html('');	
			$.ajax({
					 type: 'POST',
					 url: apipath+'requestShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id,
					 
					 success: function(result) {
						 	

							if (result==''){
								$("#btn_req_search").show();
								$("#btn_req_all").show();
								$("#wait_req_image").hide();
								$("#reqChember").html('Sorry Network not available');
								
							}else{
								var resultArray = result.split('rdrd');
								if (resultArray[0]=='Success'){													

									//Profile
									var reqStr=resultArray[1];													
									
									var reqStrArray = reqStr.split('<fdrd>');
									
									
									//var reqStrFull='<table  border="0" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%; border-bottom:solid; border-bottom-color:#999; font-size:70%;">'
									var reqStrFull='<table  border="0" cellpadding="0" cellspacing="0" width="100%">'
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
										
										reqStrFull = reqStrFull+'<tr ><td colspan="2" style="font-size:16px;">'+patinet_name+'</td>'
										if (status == 'SUBMITTED'){ 
												   reqStrFull = reqStrFull + '<td rowspan="2" width="25px" ><a  data-role="button" onClick="confirm_app('+ row_id+');"><img  height="25px" width="25px" src="ok.png"></a></td>'
												   //reqStrFull = reqStrFull + '<td width="50px" ><input  type="submit" onClick="confirm_app('+ row_id+');" value="Confirm"></td>'
												  }
												  else if (status == 'CONFIRMED'){ 
												   reqStrFull = reqStrFull + '<td rowspan="2" width="25px" ><br>&nbsp;&nbsp;<img height="30px" width="30x" src="confirmed.png"></td>'
												   //reqStrFull = reqStrFull + '<td width="50px" ><input  type="submit" onClick="confirm_app('+ row_id+');" value="Confirm"></td>'
												  }
												  else{
													 // reqStrFull = reqStrFull +'<td  width="50px" ><input  type="submit"  disabled="disabled" style="background: url(ok.png);"></td>' 														
													reqStrFull = reqStrFull + '<td rowspan="2" width="25px" ><br>&nbsp;&nbsp;<img height="30px" width="30px" src="cancel.png"></td>'
													//reqStrFull = reqStrFull +'<td   ><input  type="submit" value=" '+status+' " disabled="disabled" src="ok.png"></td>' 
													  }
										
										
										
										            reqStrFull = reqStrFull + ' </tr>'
													
													 reqStrFull = reqStrFull +'<tr >'
													 reqStrFull = reqStrFull +'<td  ><input style="font-size:14px; width=50px;" id="'+ apptime_date +'" name="'+ apptime_date+'" type="date" value="'+date_get+'"></td>'
													 reqStrFull = reqStrFull +'<td   ><input style="font-size:14px;width=40px" id="'+ apptime_time +'" name="'+ apptime_time+'" type="time" value="'+time_get+'"></td>'
												  //if (status == 'SUBMITTED'){ 
//												   reqStrFull = reqStrFull + '<td width="25px" ><a   data-role="button" onClick="confirm_app('+ row_id+');"><img  height="25px" width="25px" src="ok.png"></a></td>'
//												   //reqStrFull = reqStrFull + '<td width="50px" ><input  type="submit" onClick="confirm_app('+ row_id+');" value="Confirm"></td>'
//												  }
//												  else if (status == 'CONFIRMED'){ 
//												   reqStrFull = reqStrFull + '<td width="25px" ><a height="20px" width="25x" data-role="button" ><img height="25px" width="25x" src="confirmed.png"></a></td>'
//												   //reqStrFull = reqStrFull + '<td width="50px" ><input  type="submit" onClick="confirm_app('+ row_id+');" value="Confirm"></td>'
//												  }
//												  else{
//													 // reqStrFull = reqStrFull +'<td  width="50px" ><input  type="submit"  disabled="disabled" style="background: url(ok.png);"></td>' 														
//													reqStrFull = reqStrFull + '<td width="25px" ><a height="20px" width="25x" data-role="button" ><img height="25px" width="25px" src="cancel.png"></a></td>'
//													//reqStrFull = reqStrFull +'<td   ><input  type="submit" value=" '+status+' " disabled="disabled" src="ok.png"></td>' 
//													  }
													reqStrFull = reqStrFull+'</tr>  <tr style="background-color:#008A8A; font-size:1px" ><td>&nbsp;</td><td></td><td></td></tr>'  
													  
									  
										}
							        
									
									reqStrFull = reqStrFull + '</table>'
									
									//alert (localStorage.reqStrFull);
									localStorage.reqStrFull=reqStrFull;
									
									//$("#reqList").html(localStorage.reqStrFull);	
									
									$("#reqChember").html(localStorage.chamber_show);	
									$("#reqList").empty();
									$("#reqList").append(localStorage.reqStrFull).trigger('create');
									
									$("#all_button").show();
									$("#wait_image_chamber_info").hide();
									
									
									$("#btn_req_search").show();
									$("#btn_req_all").show();
									$("#wait_req_image").hide();
									
									
									url = "#page_request_show";
									$.mobile.navigate(url);								
									

			
								}else {
									 
									$("#all_button").show();
									$("#wait_image_chamber_info").hide();	
									
									$("#btn_req_search").show();
									$("#btn_req_all").show();
									$("#wait_req_image").hide();
									
									$("#error_request_show").html("Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						$("#all_button").show();
						$("#wait_image_chamber_info").hide();
						//  $("#error_login").html('Invalid Request');
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	    url = "#page_request_show";
		$.mobile.navigate(url);
	
}
function req_show(){
	$("#error_request_show").html("");
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
		
		reqStrFull = reqStrFull+'<tr ><td colspan="2" style="font-size:16px;">'+patinet_name+'</td>'
										if (status == 'SUBMITTED'){ 
												   reqStrFull = reqStrFull + '<td rowspan="2" width="25px" ><a  data-role="button" onClick="confirm_app('+ row_id+');"><img  height="25px" width="25px" src="ok.png"></a></td>'
												   //reqStrFull = reqStrFull + '<td width="50px" ><input  type="submit" onClick="confirm_app('+ row_id+');" value="Confirm"></td>'
												  }
												  else if (status == 'CONFIRMED'){ 
												   reqStrFull = reqStrFull + '<td rowspan="2" width="25px" ><br>&nbsp;&nbsp;<img height="30px" width="30x" src="confirmed.png"></td>'
												   //reqStrFull = reqStrFull + '<td width="50px" ><input  type="submit" onClick="confirm_app('+ row_id+');" value="Confirm"></td>'
												  }
												  else{
													 // reqStrFull = reqStrFull +'<td  width="50px" ><input  type="submit"  disabled="disabled" style="background: url(ok.png);"></td>' 														
													reqStrFull = reqStrFull + '<td rowspan="2" width="25px" ><br>&nbsp;&nbsp;<img height="30px" width="30px" src="cancel.png"></td>'
													//reqStrFull = reqStrFull +'<td   ><input  type="submit" value=" '+status+' " disabled="disabled" src="ok.png"></td>' 
													  }
										
										
										
										            reqStrFull = reqStrFull + ' </tr>'
													
													 reqStrFull = reqStrFull +'<tr >'
													 reqStrFull = reqStrFull +'<td  ><input style="font-size:14px; width=50px;" id="'+ apptime_date +'" name="'+ apptime_date+'" type="date" value="'+date_get+'"></td>'
													 reqStrFull = reqStrFull +'<td   ><input style="font-size:14px;width=40px" id="'+ apptime_time +'" name="'+ apptime_time+'" type="time" value="'+time_get+'"></td>'

													reqStrFull = reqStrFull+'</tr>  <tr style="background-color:#008A8A; font-size:1px" ><td>&nbsp;</td><td></td><td></td></tr>'  
													  
									  
										}
							        
									
									reqStrFull = reqStrFull + '</table>'
		
		//reqStrFull = reqStrFull = reqStrFull+'<tr ><td colspan="3" style=" font-size:14px; color:#008040">'+patinet_name+'</td></tr>'
//													+'<tr >'
//													+'<td  ><input style="font-size:14px; width=50px;" id="'+ apptime_date +'" name="'+ apptime_date+'" type="date" value="'+date_get+'"></td>'
//													+'<td   ><input style="font-size:14px;width=40px" id="'+ apptime_time +'" name="'+ apptime_time+'" type="time" value="'+time_get+'"></td>'
//				  if (status == 'SUBMITTED'){ 
//				   
//				   reqStrFull = reqStrFull + '<td style="width:50%;" ><input type="submit" onClick="confirm_app('+ row_id+');" value=" Confirm "></td>'
//				  }
//				  else{
//					reqStrFull = reqStrFull +'<td style="width:50%;" ><input type="submit" value=" '+status+' " disabled="disabled" ></td>' 
//					  }
//					reqStrFull = reqStrFull+'</tr>'  
//					  
//	  
//		}
//	
//	
//	reqStrFull = reqStrFull + '</table>'
	
	//alert (localStorage.reqStrFull);
	localStorage.reqStrFull=reqStrFull;	
	$("#reqList").empty();
	$("#reqList").append(localStorage.reqStrFull).trigger('create');
	
	$("#btn_req_search").show();
	$("#btn_req_all").show();
	$("#wait_req_image").hide();
	

	url = "#page_request_show";
	$.mobile.navigate(url);			
	
}

function confirm_app(row_id){
	var apptime_date=row_id+'date'
	var apptime_time=row_id+'time'
	
	var apptime_date_val=$("#"+apptime_date).val()
	var apptime_time_val=$("#"+apptime_time).val()
	
	var apptime=apptime_date_val+" "+apptime_time_val
	
	//alert (apptime);
	
	var chamber_show=localStorage.chamber_show;
	var chamber_id=chamber_show.split('|')[1]
	
//$("#error_request").html(apipath+'confirm_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&chamber_id='+localStorage.chamber_id+'&apptime='+apptime);
										
	$.ajax({
			 type: 'POST',
			 url: apipath+'confirm_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&row_id='+row_id+'&chamber_id='+localStorage.chamber_id+'&apptime='+apptime,
			 
			 success: function(result) {											
					if (result==''){
						$("#error_profile_edit").html('Sorry Network not available');
						
					}else{
						 
						if (result.split('rdrd')[0]=='Success'){													
							
							localStorage.reqStrFull=result.split('rdrd')[1]
							page_chember_req_show();

							$("#error_request").html('Confirmed Succesfully');	
							
							 //url = "#page_request_show";
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
				  url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
}

function req_app_search_all(){
		$("#btn_req_search").hide();
		$("#btn_req_all").hide();
		$("#wait_req_image").show();
		 page_chember_req_show();
}



function req_app_search(){
	$("#error_request").html("");
	var req_search=$("#req_search").val()
	
	
	
	//$("#error_request").html(apipath+'search_req_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&req_search='+req_search+'&chamber_id='+localStorage.chamber_id);
	if (req_search.length < 10){
		$("#error_request").html('Please select a date.');
		
	}
	else{	
		$("#btn_req_search").hide();
		$("#btn_req_all").hide();
		$("#wait_req_image").show();
		
		$.ajax({
				 type: 'POST',
				 url: apipath+'search_req_app?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&req_search='+req_search+'&chamber_id='+localStorage.chamber_id,
				 
				 success: function(result) {											
						if (result==''){
							$("#btn_req_search").show();
							$("#btn_req_all").show();
							$("#wait_req_image").hide();
							$("#error_request").html('Sorry Network not available');
							
						}else{
							 
							if (result.split('rdrd')[0]=='Success'){													
								$("#error_request").html('');
								localStorage.reqStrFull=result.split('rdrd')[1]
								
								//alert (localStorage.chamber_show);
								req_show();
	
								$("#btn_req_search").show();
								$("#btn_req_all").show();
								$("#wait_req_image").hide();
								
							}else {
								 
								$("#btn_req_search").show();
								$("#btn_req_all").show();
								$("#wait_req_image").hide();
								$("#error_request").html('Appoinment not Available.');													
								
							//	$("#error_request").html(result.split('rdrd')[0]);
								//$('#syncBasic').show();
							}
												
							
						}
					  },
				  error: function(result) {					 
					  $("#wait_image_login").hide();
					  $("#loginButton").show();
					
					  $("#btn_req_search").show();
					  $("#btn_req_all").show();
					  $("#wait_req_image").hide();
							
					  url = "#login";
					  $.mobile.navigate(url);	
				  }
			  });//end ajax
		
	}
	
}


function page_con_appoinment_show(){
	
	$("#reqConChember").html(localStorage.chamber_show);
	$("#error_con_list").html("")
	
	$("#all_button").hide();
	$("#wait_image_chamber_info").show();
	
	
	
	
	
	//$("#error_request_show").html(apipath+'confirmedShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id);
										
			$.ajax({
					 type: 'POST',
					 url: apipath+'confirmedShow?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id,
					 
					 success: function(result) {											
							if (result==''){
								$("#btn_con_search").show();
								$("#btn_con_all").show();
								$("#wait_con_image").hide();
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								var resultArray = result.split('rdrd');
								if (resultArray[0]=='Success'){													

									//Profile
									var reqStr=resultArray[1];													
									
									var reqStrArray = reqStr.split('<fdrd>');
									

									var reqConStrFull=''
									
									
									for(i=0; i < reqStrArray.length-1; i++){
										
										var reqStrSingle=reqStrArray[i];
										
										var reqStrSingleArray = reqStrSingle.split('fdfd');
										
										var row_id=reqStrSingleArray[0];
										var patinet_name=reqStrSingleArray[1];
										var patinet_mobile=reqStrSingleArray[2];
										var app_time=reqStrSingleArray[3];
            							
										var apptime_text=row_id+'time'
										
										var date_get="";
										var time_get="";
										if (app_time.length > 10){
											date_get=app_time.split(' ')[0]
											time_get=app_time.split(' ')[1]
										}
										var date_get_new=new Date(date_get)
										
										reqConStrFull = reqConStrFull+'<li class="ui-btn ui-shadow ui-corner-all " onClick="page_appoinment_new()">'
										+'<table  border="0" >'
										
										+'<tr ><td style="width:60%; font-size:16px; color:#008040">'+patinet_name+'</td>'
													
										+'<td  style="width:60%; font-size:14px; color:#008040" >'+date_get_new.toString().substring(0, 10)+'</td>'									
										+'<td   ><input style="font-size:14px;width=40px; color:#1D5C30;  background-color:#7BCCD2"  type="time" value="'+time_get+'" readonly="readonly"></td>'
										
										+'</tr></table></li>'
//													
//													+'</tr></table></li>'
										
										//reqConStrFull = reqConStrFull+'<input type="submit" style="width:50%; font-size:14px; color:#008040" onClick="page_appoinment_new()" value="'+patinet_name+'&nbsp;&nbsp;&nbsp;'+app_time +'">'

									
									}
									
							        reqConStrFull = reqConStrFull 
									localStorage.reqConStrFull=reqConStrFull;
									
									
									$("#reqConList").empty();
									$("#reqConList").append(localStorage.reqConStrFull).trigger('create');
											
									$("#all_button").show();
									$("#wait_image_chamber_info").hide();
									
									$("#btn_con_search").show();
									$("#btn_con_all").show();
									$("#wait_con_image").hide();

									url = "#page_con_appoinment_show";
									$.mobile.navigate(url);								
									

			
								}else {
									 
									$("#all_button").show();
									$("#wait_image_chamber_info").hide();
									//$("#error_login").html('Server Error');													
									
									$("#btn_con_search").show();
									$("#btn_con_all").show();
									$("#wait_con_image").hide();
									
									$("#error_request").html('Appoinment not Available.');
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						 $("#all_button").show();
						 $("#wait_image_chamber_info").hide();
						//  $("#error_login").html('Invalid Request');
						
						  $("#btn_con_search").show();
						  $("#btn_con_all").show();
						  $("#wait_con_image").hide();
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
	
	    url = "#page_con_appoinment_show";
		$.mobile.navigate(url);
	
}
function page_con_appoinment_search_all(){
	$("#btn_con_search").hide();
	$("#btn_con_all").hide();
	$("#wait_con_image").show();
	page_con_appoinment_show();
}

function page_con_appoinment_search(){
	
	$("#reqConChember").html(localStorage.chamber_show);
	var searchConfirm = $("#searchConfirm").val();
	
	if (searchConfirm.length < 10){
		$("#error_con_list").html("Please Enter a Date")
	}
	else{
	//alert ("NNN");
	
	//$("#error_con_list").html(apipath+'confirmedShowSearch?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id+'&searchConfirm='+searchConfirm);
			
			$("#btn_con_search").hide();
			$("#btn_con_all").hide();
			$("#wait_con_image").show();
			
			$.ajax({
					 type: 'POST',
					 url: apipath+'confirmedShowSearch?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_id='+localStorage.chamber_id+'&searchConfirm='+searchConfirm,
					 
					 success: function(result) {											
							if (result==''){
								$("#error_profile_edit").html('Sorry Network not available');
								
							}else{
								$("#error_con_list").html("")
								var resultArray = result.split('rdrd');
								if (resultArray[0]=='Success'){													
									
									//Profile
									var reqStr=resultArray[1];													
									
									var reqStrArray = reqStr.split('<fdrd>');
									

									var reqConStrFull=''
									for(i=0; i < reqStrArray.length-1; i++){
										
										var reqStrSingle=reqStrArray[i];
										
										var reqStrSingleArray = reqStrSingle.split('fdfd');
										
										var row_id=reqStrSingleArray[0];
										var patinet_name=reqStrSingleArray[1];
										var patinet_mobile=reqStrSingleArray[2];
										var app_time=reqStrSingleArray[3];
            							
										var apptime_text=row_id+'time'
										//reqConStrFull = reqConStrFull+'<input type="submit" style="width:50%; font-size:14px; color:#008040" onClick="page_appoinment_new()" value="'+patinet_name+'&nbsp;&nbsp;&nbsp;'+app_time +'">'
//
//									
//									
//									
//							        reqConStrFull = reqConStrFull + '</table>'
									
									
									
									
									
									    var date_get="";
										var time_get="";
										if (app_time.length > 10){
											date_get=app_time.split(' ')[0]
											time_get=app_time.split(' ')[1]
										}
										var date_get_new=new Date(date_get)
										//alert (date_get_new.toString().substring(0, 10))

										
										
										
										
										
										
										reqConStrFull = reqConStrFull+'<li class="ui-btn ui-shadow ui-corner-all " onClick="page_appoinment_new()">'
										+'<table  border="0" >'
										
										+'<tr ><td style="width:60%; font-size:14px; color:#008040">'+patinet_name+'</td>'
										
										
										//+'<td  >'+date_get+'</td>'									
//										+'<td   ><input style="font-size:14px;width=40px; color:#1D5C30; background-color:#EAF4F4"  type="time" value="'+time_get+'" readonly="readonly""></td>'
//										
//										+'</tr></table></li>'			
										+'<td  ><input style="font-size:14px;width=40px; color:#1D5C30; background-color:#EAF4F4"  type="text" value="'+date_get_new.toString().substring(0, 10)+'" readonly="readonly"></td>'									
										+'<td   ><input style="font-size:14px;width=40px; color:#1D5C30; background-color:#EAF4F4"  type="time" value="'+time_get+'" readonly="readonly""></td>'
										
										+'</tr></table></li>'
									
									}
									
									localStorage.reqConStrFull=reqConStrFull;
									
									
									$("#reqConList").empty();
									$("#reqConList").append(localStorage.reqConStrFull).trigger('create');
																
									
									$("#btn_con_search").show();
									$("#btn_con_all").show();
									$("#wait_con_image").hide();
									url = "#page_con_appoinment_show";
									$.mobile.navigate(url);								
									

			
								}else {
									 
									$("#btn_con_search").show();
									$("#btn_con_all").show();
									$("#wait_con_image").hide();													
									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");
									//$('#syncBasic').show();
								}
													
								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						//  $("#error_login").html('Invalid Request');
						  
						  
						   $("#btn_con_search").show();
							$("#btn_con_all").show();
							$("#wait_con_image").hide();
						  
						  url = "#login";
						  $.mobile.navigate(url);	
					  }
				  });//end ajax
			}//End else
	    url = "#page_con_appoinment_show";
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
							
							 //url = "#page_request_show";
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
				  url = "#login";
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
	url = "#page_con_appoinment_show";
	$.mobile.navigate(url);			
	
}

function page_appoinment_new(){
	//$("#next_week").val("");
	$("#error_new_app").html('');
	var week_combo_show='<select name="next_week" id="next_week" >'
        week_combo_show=week_combo_show+'<option  selected value=""></option>'
        week_combo_show=week_combo_show+'<option  value="1">1</option>'
        week_combo_show=week_combo_show+'<option  value="2">2</option>'
        week_combo_show=week_combo_show+'<option  value="3">3</option>'
        week_combo_show=week_combo_show+'<option  value="4">4</option>'
        week_combo_show=week_combo_show+'<option  value="4">6</option>'
        week_combo_show=week_combo_show+'</select>'
	
	$("#week_combo").empty();
	$("#week_combo").append(week_combo_show).trigger('create');
	
	url = "#page_appoinment_new";
	$.mobile.navigate(url);	
}

function show_chamber_div(){
	var area_show=localStorage.areaStr;
	var doc_area='<select name="area_new" id="area_new" >'
	doc_area= doc_area+'<option  value=""></option>'
	
	var areaStrArray=area_show.split('fdfd')
	for(i=0; i < areaStrArray.length-1; i++){
		doc_area= doc_area+'<option  value="'+areaStrArray[i]+'">'+areaStrArray[i]+'</option>'
	}
	doc_area=doc_area+'</select>'
	
	
	$("#area_combo_new").empty();
	$("#area_combo_new").append(doc_area).trigger('create');
	
	
	
	$("#wait_image_new_chamber").hide();
	url = "#page_new_Chamber";
	$.mobile.navigate(url);
	
	//$("#add_new_chamber").show();
}
function add_new_chamber(){
	var area_new = $("#area_new").val();
	var chamber_name_new = $("#chamber_name_new").val();
	var chamber_address_new = $("#chamber_address_new").val();
	var assistant_mobile1_new = $("#assistant_mobile1_new").val();
	var assistant_mobile2_new = $("#assistant_mobile2_new").val();
	var visiting_duration_new = $("#visiting_duration_new").val();
	var auto_serial_new = $("#auto_serial_new").val();
	var blockedSL_new = $("#blockedSL_new").val();
	
	//alert (area_new);
	var area=area_new.split('|')[1]
	var district=area_new.split('|')[0]
	//alert (district)
	
	
	//$("#settingsChember_new").html(apipath+'add_chamber?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_name_new='+chamber_name_new+'&area='+area+'&district='+district+'&chamber_address_new='+chamber_address_new+'&assistant_mobile1_new='+assistant_mobile1_new+'&assistant_mobile2_new='+assistant_mobile2_new+'&visiting_duration_new='+visiting_duration_new+'&auto_serial_new='+auto_serial_new+'&blockedSL_new='+blockedSL_new);
	
	if ((chamber_name_new.replace(/ /g,'')).length == 0){
		//$("#error_chamber_list").html(area_new);
		chamber_name_new=area;
	}
	
	
	//alert (new_chamber_name.replace(/ /g,'').length);
	
	if ((chamber_name_new.replace(/ /g,'')).length == 0){
		$("#settingsChember_new").html("Please Enter Chamber Name.");
		
	}
	else{
		$.ajax({
				 type: 'POST',
				 url: apipath+'add_chamber?doc_id='+localStorage.user_id+'&password='+localStorage.user_pass+'&sync_code='+localStorage.sync_code+'&chamber_name_new='+chamber_name_new+'&area='+area+'&district='+district+'&chamber_address_new='+chamber_address_new+'&assistant_mobile1_new='+assistant_mobile1_new+'&assistant_mobile2_new='+assistant_mobile2_new+'&visiting_duration_new='+visiting_duration_new+'&auto_serial_new='+auto_serial_new+'&blockedSL_new='+blockedSL_new,
				 
				 success: function(result) {											
						if (result==''){
							$("#error_chamber_list").html('Sorry Network not available');
							
						}else{
							 
							if (result.split('rdrd')[0]=='Saved Successfully'){													
								
								localStorage.chamberStr=result.split('rdrd')[1]
	
						
								 chember_show();
								 $("#error_chamber_list").html(result.split('rdrd')[0]);
								 
								 url = "#page_chamber_show";
								 $.mobile.navigate(url);
							}else if (result.split('rdrd')[0]=='Already Exist'){													
								
								localStorage.chamberStr=result.split('rdrd')[1]
								
	
								chember_show();
								$("#error_chamber_list").html(result.split('rdrd')[0]);	
								
								 url = "#page_chamber_show";
								 $.mobile.navigate(url);
							}else {
								 
								//$("#wait_image_login").hide();
	//									$("#loginButton").show();
								//$("#error_login").html('Server Error');													
								
								$("#error_chamber_list").html("Sync Failed. Authorization or Network Error.");
								//$('#syncBasic').show();
							}
												
							
						}
					  },
				  error: function(result) {					 
					  $("#wait_image_login").hide();
					  $("#loginButton").show();
					//  $("#error_login").html('Invalid Request');
					//  alert ("sdfdsg")
					  url = "#login";
					  $.mobile.navigate(url);	
				  }
		});//end ajax
		$("#add_new_chamber").hide();
	}
	
	
	
	
}
function newapptSave(){
	//alert ("ADASD")
	var next_week= $("#next_week").val();
	if (next_week!=''){
		$("#error_new_app").html('Saved Successfully');
	}
	else{
		$("#error_new_app").html('Select Week');
	}
}
//-------------Blank error msg
function blank_error_msg(){
	$("#error_login").html('');
	$("#error_home").html('');
	
	$("#error_chamber_list").html('');
	$("#error_profile_edit").html('');
	$("#error_request_show").html('');
	$("#error_request").html('');
	$("#error_con_list").html('');
	$("#error_setings_chamber").html('');
	$("#error_setings_chamber_1").html('');
	$("#error_schedule").html('');
	$("#error_offday").html('');
	
	$("#error_new_app").html('');
	
	
	

}

//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}







