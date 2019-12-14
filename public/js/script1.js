
window.onload=function(){
  var today = new Date();
  var hours=today.getHours()+2;
  if(hours>=24)
      hours=hours%24;
  if((today.getDay()==0)||(today.getDay()==6)){
    document.getElementById("res_time").max="23:59";
    if(hours>=0&&hours<9){
      today.setDate(today.getDate()+1);
      if(today.getDay()==0){
        document.getElementById("res_time").min="09:00";
        document.getElementById("res_time").value="09:00";
      }
      else{
        document.getElementById("res_time").min="10:00";
        document.getElementById("res_time").max="22:59";
        document.getElementById("res_time").value="10:00";  
      }
    }
    else{
      document.getElementById("res_time").min=(hours+':00');
      document.getElementById("res_time").value=(hours+':00');
    }
  }
  else{
    document.getElementById("res_time").max="22:59";
    if(hours==23||(hours>=0&&hours<10)){
      today.setDate(today.getDate()+1); 
      if(today.getDay()==6){
        document.getElementById("res_time").min="09:00";
        document.getElementById("res_time").max="23:59";
        document.getElementById("res_time").value="09:00";
      }
      else{
      document.getElementById("res_time").min="10:00";
      document.getElementById("res_time").value="10:00";
      }
    }
    else{
      document.getElementById("res_time").value=(hours+':00');
      document.getElementById("res_time").min=(hours+':00');
    }
  }
  var numberOfDaysToAdd = 7;
  var max=new Date();
  
  max.setDate(today.getDate() + numberOfDaysToAdd)
  document.getElementById("res_date").max=max.toISOString().substr(0,10);
  document.getElementById("res_date").min=today.toISOString().substr(0,10);
  document.getElementById("res_date").value=today.toISOString().substr(0,10);
  
}



function DateChange(){
  var today = new Date();
  if(document.getElementById("res_date").value==today.toISOString().substr(0, 10)){
    var hours=today.getHours();
    document.getElementById("res_time").value=(hours+':00');
    document.getElementById("res_time").min=(hours+':00');
  }
  else{  
    var d=document.getElementById("res_date").value;
    var day=new Date(d);
    console.log(day.getDay());
    if((day.getDay()==0)||(day.getDay()==6)){
      document.getElementById("res_time").min="09:00";
      document.getElementById("res_time").max="23:59";
      document.getElementById("res_time").value="09:00";
    }
    else{
      document.getElementById("res_time").min="10:00";
      document.getElementById("res_time").max="22:59";
      document.getElementById("res_time").value="10:00";
    }}
}

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
//Function To Display Popup
/*
function div_show() {
document.getElementById('abc').style.display = "block";
}*/
function div_show2() {
document.getElementById('abc2').style.display = "block";
}

//Function to Hide Popup
/*
function div_hide(){
document.getElementById('abc').style.display = "none";
}*/
function div_hide2(){
document.getElementById('abc2').style.display = "none";
}

$(document).ready(function(){
  $('.header').height($(window).height());
})
