var login_shown = false;

function show_login() {
	if(login_shown === false) {
		document.getElementById("login-form").style.display = "table";
		document.getElementById("login-dropdown").style.backgroundColor = "#ffffff";
		document.getElementById("login-dropdown").children[0].style.color = "#000000";
		login_shown = true;
	} else {
		document.getElementById("login-form").style.display = "none";
		document.getElementById("login-dropdown").style.backgroundColor = "#000000";
		document.getElementById("login-dropdown").children[0].style.color = "#ffffff";
		login_shown = false;
	}
}