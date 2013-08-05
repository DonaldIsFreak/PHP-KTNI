/**
 * 
 */

var DEBUG_MODE = true;
var PLURK_URL = 'http://www.plurk.com/?qualifier=thinks&status=';
var TWITTER_URL = 'http://twitter.com/home/?status=';
var FACEBOOK_URL = 'http://www.facebook.com/share.php?u=';

function updateColor(selector){
	$(selector).each(function(i){
		$(this).css('color',generateColor());
	});
}
function sumArray(arrays){
	var sum = 0;
	for (var i=0; i<arrays.length; i++)
		sum+=arrays[i];
	return sum;
}
function generateColor(){
    var color,rgb=0;
    //RGB color must between #000000 and #fffff, BUT not include #000000 and #FFFFFF
    while (rgb==0 || rgb == 765){
    	color = new Array();
    	for (var i=0; i<3; i++)
    		color.push(Math.floor(Math.random()*255));
    	rgb = sumArray(color);
    }
    return format('rgb(%1)',color.join(','));
}

function catchPosition(jObj){
	text = jObj.attr('id');
	return text.split('_')[1];
}
function catchText(position){
	return trim($('#input_'+position).val());
}
function toMicroBlogger(publisher,position){
	var comment = catchText(position);
	if (comment == ''){
		displayError(format('%1 IDEA is null.',position.toUpperCase()));
		return false;
	}
	var URL = false;
	switch(publisher){
		case 'plurk':
			URL = PLURK_URL;
			break;
		case 'twitter':
			URL = TWITTER_URL;
			break;
		case 'facebook':
			URL = FACEBOOK_URL;
			break;
	}
	return window.open(URL.concat(comment)); 
}
function displayError(msg){
	display(msg,true);
}
function displayMsg(msg){
	display(msg,false);
}
function display(msg,error){
	if (trim(msg)=='')
		msg = 'No any message.';
	var jObj = $("#message").text(msg); 
	if (error)
		jObj.addClass('warning');
	else
		jObj.removeClass('warning');
	jObj.fadeIn().delay(5000).fadeOut();	
}
function getToday(){
	return $.ajax({
		type:		'get',
		url:		'ajax.php',
		async:		false,
		data:		{'action':'today','rnd':Math.random()},
		success:	function(result){
		}
	}).responseText;
	//return $.datepicker.formatDate('yy-mm-dd',new Date());
}
function modifyIdea(position,comment,date){
	$.ajax({
		type: 		'get',
		url:		'ajax.php',
		data:		{'action':'modify','comment':comment,'position':position,'date':date,'rnd':Math.random()},
		success: 	function(result){
			log('After modify:',result);
			if (false!==result){
				log('after Modify ',result);
				$('#input_'+position).data('id',result);
				displayMsg('Successed!!!');
			}
		}
	});
}
function getAllIdeas(date){
	$.ajax({
		type:		'get',
		url:		'ajax.php',
		data:		{'action':'get','date':date,'rnd':Math.random()},
		dataType:	'json',
		success:	function(result){
			log('After get:',result);
			if ('[]' !== result){
				$.each(result,function(i){
					var idea = result[i];
					log('Get position id',idea.position,idea.id);
					$('#input_'+idea.position).val(idea.comment).data('id',idea.id);
				});
			}
			refreshAllTags(getToday());
		}
	});
}
function initToday(){
	var today = getToday();
	$('#today').text(function(i,text){
		return text + today;
	});	
	var today_text = $.datepicker.formatDate('yy-M-d-DD',new Date(today));
	var today_array = today_text.split('-');
	log('today-text',today_text);
	$('#year').text(today_array[0]);
	$('#month').text(today_array[1]);
	$('#date').text(today_array[2]);
	if (today_array[3]== 'Sunday' || today_array[3]=='Saturday')
		$('#date').css('color','red');
	$('#day').text(today_array[3]);
}
function getAllTags(event,ui){
	var position = $(this).data('position');
	log('What is this?',$(this));
	$.ajax({
		type: 		'get',
		url:		'ajax.php',
		data:		{'action':'allTags','rnd':Math.random()},
		dataType:	'json',
		success:	function(result){
			if ('[]'!== result){
				log('Get all tags',result);
				var jObj = $('#lt_tags');
				$.each(result,function(i){
					log('Append tag to dialog');
					var tag = result[i],tag_link=$("<a>").text(tag.name).attr('id',format('%1_%2',position,tag.id)).bind('click',function(){
						log('Clikc tag link',$(this).attr('id'));
						tagging(position,tag.id);
					});
					jObj.append(tag_link);
				});
			}
		}
	});
}
function addTag(){
	var position=$('#dg_tags').data('position'),lt_tags = $('#lt_tags'),input_tag = $('#input_tag'),name=trim(input_tag.val());
	$.ajax({
		type: 		'get',
		url:		'ajax.php',
		data:		{'action':'addTags','name':name,'rnd':Math.random()},
		success:	function(result){
			if (false !== result){
				var new_tag = $("<a>").attr('id',format('%1_%2',position,result)).text(name).bind('click',function(){
					log('Click tag link',new_tag.attr('id'));
					tagging(position,result);
				}); 
				lt_tags.append(new_tag);
				$("#dg_addBlock").fadeOut();
			}
		}
	
	});	
}
function refreshAllTags(date){
	$('input.idea').each(function(){
		var id = $(this).data('id');
		log('Run refresh tags',id);
		if (id){
			refreshTags(id,catchPosition($(this)));
		}
	});
}
function refreshTags(id,position){
	log('begin refresh tag');
	$.ajax({
		type: 	'get',
		url:	'ajax.php',
		data:	{'action':'tags','id':id,'rnd':Math.random()},
		dataType:	'json',
		success:	function(result){
			log('After refresh tag',result);
			if (false !== result){
				var jObj=$('#tags_'+position);
				jObj.find('a').remove();
				$.each(result,function(i){
					var tag = result[i];
					jObj.append($("<a>").text(tag.name));
				});
				
			}
		}
	});
}
function tagging(position,tag){
	var id = $('#input_'+position).data('id');
	log('Tagging the ideas to the tag id',position,id);
	$.ajax({
		type: 		'get',
		url:		'ajax.php',
		data:		{'action':'tagging','id':id,'tag':tag,'rnd':Math.random()},
		success:	function(result){
			if (false !== result){
				log('after tagging',result);
				refreshTags(id,position);
			}
		}
	});	
}
$(document).ready(function(){
	$("p.warning").remove();
	initToday();
	$('#datepicker').datepicker({
		dateFormat: 'yy-mm-dd',
		showOn: 'button',
		gotCurrent: true,
		maxDate: '+0 d',
		minDate: '-1 w',
		onSelect: function(dateText,inst){
			log(dateText,inst);
			log($(this).datepicker('getDate'));
		},
		onChangeMonthYear: function(year,month,inst){
			log(year+','+month,inst);
		}
	});
	$('input.idea').focusin(function(){
		$(this).addClass('input_focus');
	}).focusout(function(){
		$(this).removeClass('input_focus');
	});
	$('.bt_submit').hover(function(){
		$(this).addClass('bt_submit_hover');
		$(this).css('color',generateColor());
	},function(){
		$(this).removeClass('bt_submit_hover');
		$(this).css('color','#ffffff');
	}).bind('click',function(){
		var position = catchPosition($(this));
		log('bt_submit who click?',$(this));
		log('Click id is',position);
		var comment = catchText(position);
		if (comment== ''){
			displayError('Comment is null');
			return false;
		}
		modifyIdea(position,comment,getToday());
	});
	
	//bt_plurk
	$('.bt_plurk').click(function(){
		log('Click bt_pluck');
		var position = catchPosition($(this));
		toMicroBlogger('plurk',position);
	});
	
	//bt_twitter
	$('.bt_twitter').click(function(){
		log('Click bt_twitter');
		var position = catchPosition($(this));
		toMicroBlogger('twitter',position);
	});
	
	//bt_facebook
	$('.bt_facebook').click(function(){
		log('Click bt_facebook');
		var position = catchPosition($(this));
		toMicroBlogger('facebook',position);
	});
	
	//add_tag
	$('.add_tag').click(function(){
		var position = catchPosition($(this));
		log('Add tag position',position);
		//List all tags
		var jObj = $('#dg_tags').data('position',position);
		jObj.dialog({
			'title':	'Add Tags',		
			'modal':	true,
			'open': 	getAllTags,
			'close':	function(){
				$('#lt_tags a').remove();
			}
		});
	});
	$(".header").eq(1)
		.text(function(i,text){
			var arraws = ['<-','->'];
			return format('%1 %2',text,arraws[Math.floor(Math.random()*2)]);
		})
		.eq(2)
		.css('font-size','30pt');
	$("#lt_tags a").bind('click',function(){
		log('Clikc tag link',$(this).attr('id'));
	});
	//Inital random color to tag
	updateColor('.header');
	updateColor('.labels');
	updateColor('a');
	getAllIdeas(getToday());
});

