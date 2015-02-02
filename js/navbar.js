var login_shown = false;
var dropdown_mini_shown = false;

function show_login() {
	var login_form; //In this variable the login-form will be stored (DOM HTML)
	var login_place; // In this variable the place where the login-form will be moved-to is stored

	//In case of the regular navbar
	if(window.innerWidth > 1038) {
		if(login_shown === false) { //We move the login-form place and display it

			login_form = document.getElementById("login-form");
			login_place = document.getElementById("login-dropdown");
			login_place.appendChild(login_form);

			document.getElementById("login-form").style.display = "table";
			document.getElementById("login-dropdown").style.backgroundColor = "#ffffff";
			document.getElementById("login-dropdown").children[0].style.color = "#000000";
			login_shown = true;

		} else { //We hide the login-form

			document.getElementById("login-form").style.display = "none";
			document.getElementById("login-dropdown").style.backgroundColor = "#000000";
			document.getElementById("login-dropdown").children[0].style.color = "#ffffff";
			login_shown = false;

		}
	//In case of the mini-navbar
	} else {
		if(login_shown === false) { //We move the login-form place and display it

			login_form = document.getElementById("login-form");
			login_place = document.getElementById("login-container");
			login_place.appendChild(login_form);
			
			document.getElementById("page-shadow-login").className = "shown"
			document.getElementById("login-form").style.display = "table";
			login_shown = true;
		} else { //We hide the login-form
			document.getElementById("login-form").style.display = "none";
			document.getElementById("page-shadow-login").className = "hidden"
			login_shown = false;
		}
	}
}

function show_dropdown_mini() {
	if (!dropdown_mini_shown){
		document.getElementById("bullipedia-navbar-mini").className = "showDropdown";
		dropdown_mini_shown = true;
	} else{
		document.getElementById("bullipedia-navbar-mini").className = "hideDropdown";
		dropdown_mini_shown = false;
	}
}