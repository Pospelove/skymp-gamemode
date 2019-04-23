const 	chat_size 			= 50, // сколько сообщений помещаем в чат
		common_chat_size 	= 100, // размер общего чата
		I_AM				= 'Exhort'; // никнейм, тянуть с api.

var dom_time 		= document.getElementById('header__time'),
	head_chatname	= document.getElementById('header__chatname'),
	menu_ul			= document.getElementById('menu__ul'),
	chat_sendform 	= document.getElementById('chat__sendform');

var chats 			= 		// по этой штуке находим какие менюхи соотносятся с какими чатами
{
	'menu__ul__1': 'chat__1',
	'menu__ul__2': 'chat__2',
	'menu__ul__3': 'chat__3',
	'menu__ul__4': 'chat__4',
}

var scroll 			= true, // по этой штуке определяется, надо ли опускать скрол при появлении нового сообщения
	author_color 	= {};


chat_sendform.onsubmit = function(event)
{
	var chat_uls = document.getElementsByClassName('chat__ul');

	for (let i = 0; i < chat_uls.length; i++)
	{
		if (!chat_uls[i].classList.contains('hide'))
		{
			addMsg(I_AM, chat_uls[i].id.replace('chat__',''), event.srcElement[0].value, realTime(), chat_uls[i]); 
		}
	}

	chat_sendform.reset();
	event.preventDefault(); // отмена перезагрузки странцы, потом в ajax можно сделать, если будет ajax
}

menu__ul.onclick = function(event) // слушатель на все вкладки менюхи
{
	var target 		= event.target;
	active(target);
}




// т.к. нет скайримского времени на данный момент, то поставил реальное покачто
setInterval(showTime, 1000);

function showTime()
{
	dom_time.innerText = realTime();
}

function realTime ()
{
	var time 		= new Date(),
		hour 		= time.getHours().toString(),
		minute 		= time.getMinutes().toString();

	if (hour.length == 1)
	{
		hour = '0' + hour;
	} 
	
	if (minute.length == 1)
	{
		minute = '0' + minute;
	}

	
	return hour + ':' + minute
}

function active (elem) // смена цвета вкладок менюхи и смена названия в хедере 
{
	if (!elem.classList.contains('active'))
	{
		var menu_items	= document.getElementsByClassName('menu__ul__item');
		
		try
		{
			for (let i = 0; i < menu_items.length; i++)
			{
				menu_items[i].classList.remove('active');
			}
		}
		catch (e) {console.log(e);}

		elem.classList.add('active');

		if (chats.hasOwnProperty(elem.id))
		{
			chatShowing(chats[elem.id].replace('chat__',''));
		}

		if (elem.id == 'menu__ul__1') // либо можно по innerText
		{
			document.getElementById('chat__sendform').style.display = 'none';
		}
		else
		{
			document.getElementById('chat__sendform').style.display = 'flex';
		}


		// хз какие будут вкладки, если есть уникальные названия, то сюда
		switch (elem.innerText)
		{
			case 'Чат':
			header__chatname.innerText = 'Общий Чат';
			break;

			case 'RP':
			header__chatname.innerText = 'Roleplay Чат';
			break;

			default:
			header__chatname.innerText = elem.innerText;
			break;
		}
	}
}

function addMenuItem (name)
{
	var mdiv 		= document.createElement('li'),
		menu_items	= document.getElementsByClassName('menu__ul__item'),
		num			= Object.keys(chats).length + 1;

	mdiv.innerText 	= name;
	mdiv.classList.add('menu__ul__item');
	mdiv.id = 'menu__ul__' + num;
	menu_ul.appendChild(mdiv);

	chats[mdiv.id] = 'chat__' + num.toString();
	chat_sendform.insertAdjacentHTML('beforebegin', '<ul class="chat__ul chat__offli hide" id="chat__' + num + '"><div class="chatline" id="chatline__' + num + '"></div></ul>');
	
	var chat = document.getElementById('chat__' + num);
	
	chat.onscroll = function ()
	{
		if (chat.scrollTop == chat.scrollHeight - chat.clientHeight)
		{
			scroll = true;
		}
		else
		{
			scroll = false;
		}
	}

	if (menu_items.length == 8) // разделитель менюхи на 2 части
	{
		menu_ul.style.flexWrap = 'wrap';
		menu_items[3].insertAdjacentHTML('afterend', '<div class="line-break" id="lb"></div>');
	}
}

function removeMenuItem (elem)
{
	var menu_items	= document.getElementsByClassName('menu__ul__item'),
		chat 		= document.getElementById(chats[elem.id]);

	delete chats[elem.id];
	chat.remove();
	elem.remove();

	if (menu_items.length < 8 && menu_items.length >= 7) // удаление разделителя менюхи
	{
		menu_ul.style.flexWrap = 'nowrap';
		try		// чтобы проверку не делать -- в try/catch, потом можно переделать
		{
			document.getElementById('lb').remove();
		}
		catch(e){console.log(e);}
	}

	active(document.getElementById('menu__ul__1')); // переход после удаления на общий чат
}

function chatShowing (id) // хайдит и шовит нужный чат
{
	var chat_uls 	= document.getElementsByClassName('chat__ul'),
		chat 		= document.getElementById('chat__' + id),
		chatline 	= document.getElementById('chatline__' + id);

	try
	{
		for (let i = 0; i < chat_uls.length; i++)
		{
			if (!chat_uls[i].classList.contains('hide'))
			{
				chat_uls[i].classList.add('hide');
			}
		}
	}
	catch(e){console.log(e);}

	chat.classList.remove('hide');

	chatline.style.height = chat.scrollHeight;
	chat.scrollTop = chat.scrollHeight - chat.clientHeight; // держит скролл внизу
}

function addMsg (author, chat_id, msg, time, chat) // наверняка есть более эффективное решение, но покачто в рабочем состоянии
{
	var common_chat 	= document.getElementById('chat__1'),
		common_chatline = document.getElementById('chatline__1'),
		chatline 		= document.getElementById('chatline__' + chat_id),
		color;

	//if (msg.length == 0) { return; } // если не над пустых сообщений, то раскомент

	if (author_color.hasOwnProperty(author)) // можно переделать их различение по id потом, как api будет
	{
		color = author_color[author];
	}
	else
	{
		var red 	= Math.floor(50 + Math.random() * (255 + 1 - 50)),
    		green 	= Math.floor(50 + Math.random() * (255 + 1 - 50)),
    		blue 	= Math.floor(50 + Math.random() * (255 + 1 - 50));

    	color = 'rgb(' +red+ ',' +green+ ',' +blue+ ');';
    	author_color[author] = color;
    }

	chatline.insertAdjacentHTML('beforeend', '<li class="chat__ul__item">' + '[' + time + '] ' + '<span style="color:' + color + '">' + author + '</span>' + ' : ' + msg +'</li>');

	if (chatline.childNodes.length >= chat_size) // удаляем самое верхнее сообщение
	{
		chatline.removeChild(chatline.firstChild);
	}

	common_chatline.insertAdjacentHTML('beforeend', '<li class="chat__ul__item">' + '[' + time + '] ' + '<span style="color:' + color + '">' + author + '</span>' + ' : ' + msg +'</li>');

	if (common_chatline.childNodes.length >= common_chat_size) // удаляем самое верхнее сообщение
	{
		common_chatline.removeChild(common_chatline.firstChild);
	}

	if (scroll == true)
	{
		chatline.style.height = chat.scrollHeight;
		chat.scrollTop = chat.scrollHeight - chat.clientHeight;
	}
}


(function () 	// обработчики скролов на все существующие менюхи
{
	var items = document.getElementsByClassName('chat__ul');

	for (let i = 0; i < items.length; i++)
	{

		items[i].onscroll = function () 
		{
			if (items[i].scrollTop == items[i].scrollHeight - items[i].clientHeight)
			{
				scroll = true;
			}
			else
			{
				scroll = false;
			}
		}
	}
})();





// что надо сделать еще:
// добавить удаление цвета ника у тех, кто долго не пишет (хотя вряд ли кто-то встретит 2000 игроков за сессию)
// добавить затухание при скроле

// можно переделать списки сообщений так, чтобы они не были внутри div'a, а линию слева сделать отдельным div'ом,
// для этого надо переделать chatlines в скрипте на chat и удалить chatline.style.height = chat.scrollHeight;