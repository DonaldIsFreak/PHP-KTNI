/**
 * 
 */
function ltrim(text){
	return text.replace(/^\s*/gi,'');
}
function rtrim(text){
	return text.replace(/\s*$/gi,'');
}
function trim(text){
	return text.replace(/(^\s*|\s*$)/gi,'');
}

function format(){
	var length = arguments.length;
	if (length<1)
		return 'argument not enough.';
	var text = arguments[0];
	if (typeof(text)!=='string')
		return 'format text not string.';
	if (!(/.*(%\d)+.*/.test(text)))
		return 'format text not valid.';
	while (--length){
        var context = arguments[length];
        if (typeof(context) == 'object'){
           console.log(context);
        }
        var regexp = new RegExp("%"+length,"gi");
        text = text.replace(regexp,context);
	}
	return text;
	
}

function reapte(symbol,times){
	if (typeof(times)!=='number')
		return symbol;
	for (var i=0;i<=times;i++)
		symbol+=symbol;
	return symbol;
}

function log(){
	var length = arguments.length;
	if (DEBUG_MODE && length != 0){
		console.log(reapte('-',3));
		for (var i=0; i<length; i++)
			console.log(format('[%1]:%2',i,arguments[i]));
		console.log(reapte('-',3));
	}
}