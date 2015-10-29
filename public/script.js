var socket = io.connect();

function addMessage(msg, pseudo) {
	if(isUrlValid(msg)) {
		$("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + '<img src="' + msg + '"/>' + '</p></div>');

	}
}

function sentMessage() {
	if($('#messageInput').val() != "" && isUrlValid($('#messageInput').val())) {
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
		$('#messageInput').val('');
	}
	else {
		alert("validation of url failed");
	}
}

function setPseudo() {
	//check if username is taken first
	if(checkPseudo()) {
	socket.emit('checkPseudo', $('#pseudoInput').val());
	}
}

function checkPseudo() {
	if($("#pseudoInput").val() == "") {
		alert("the username field was empty!");
		return false;
	} 
	if(!isUsernameValid($("#pseudoInput").val())) {
		alert("not valid username!");
		return false;
	}
	return true;
}

function isUsernameValid(username) {
	return /^[a-zA-Z0-9_-]{3,16}$/.test(username);
}

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo']);
});
socket.on('checkPseudo', function(data) {
	console.log("checkPseudo sent from server");
	if(data.status == 'available') {
		socket.emit('setPseudo', $("#pseudoInput").val());
		$('#chatControls').show();
		$('#pseudoInput').hide();
		$('#pseudoSet').hide();
	}
	else alert("username is taken");
});

$(function() {
	$("chatControls").hide();
	$("#pseudoSet").click(function() {
		setPseudo();
	});
	$("#submit").click(function() {
		sentMessage();
	});
});