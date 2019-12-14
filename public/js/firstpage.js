if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
	document.getElementsByClassName('reserv_button')[0].addEventListener('click', reserv_buttonClicked)
	document.getElementsByClassName('reserv_info_button')[0].addEventListener('click', reserv_info_buttonClicked)
}

function div_hide4(){
document.getElementById('reserv_info').style.display = "none";
}

function reserv_buttonClicked(){
	document.getElementById('reserv_info').style.display = "block";
}

function reserv_info_buttonClicked(){
	document.getElementById("res_name1").setAttribute("value",document.getElementById("res_name").value);
	document.getElementById("res_phone1").setAttribute("value",document.getElementById("res_phone").value);
	var f1=document.getElementsByClassName('spec_form')[0];
	f1.submit();
}
