var menu = (function(){
	document.addEventListener('click', function(e) {
		if (e.target.getAttribute('class') == 'nickname') {
			let menu = document.querySelector('.group-menu');
			let top = e.target.closest('.group-memeber').getBoundingClientRect().top;

			menu.style.display = 'none';
			menu.style.top = top;
			menu.style.display = 'block';

			menu.addEventListener('mouseleave', close, false);
		}
	}, false);

	function close() {
		let item = document.querySelector('.group-menu');
		item.style.display = 'none';
		item.removeEventListener('mouseleave', close);
	}

	return {
		close: close,
	};
})();

var group = (function(menu){
	var current = [];

	function update(newGroup) {
		menu.close();

		if (newGroup.length < current.length) {
			document.querySelector('.group-list').innerHTML = '';
		}

		for (var i = 0; i < newGroup.length; i++) {
			updateItem(i, newGroup[i], current[i]);
		}

		current = newGroup;
	}

	function updateItem(id, item, old) {
		let object = getObject(id);

		let notHaveOld = (old == undefined);

		if (checkСhanges('name', item, old)) {
			object.querySelector('.nickname').innerHTML = item['name'];
		}

		if (checkСhanges('heal', item, old)) {
			object.querySelector('.heal-line .value').style.width = item['heal'] + '%';
		}

		if (checkСhanges('mana', item, old)) {
			object.querySelector('.mana-line .value').style.width = item['mana'] + '%';
		}

		if (checkСhanges('isLeader', item, old)) {
			if (item['isLeader'] != undefined && item['isLeader']) {
				object.setAttribute('class', 'group-memeber leader');
			} else {
				object.setAttribute('class', 'group-memeber');
			}
		}
	}

	function checkСhanges(key, item, old) {
		return (old == undefined) || (item[key] != old[key]);
	}

	function getObject(id) {
		let objects = document.querySelectorAll('.group-memeber');

		if (objects.length == 0 || objects[id] == undefined) {
			// создаём новый по шаблону
			let object = document.createElement('div');
			object.setAttribute('class', 'group-memeber');
			object.innerHTML = '' +
				'<div class="head-line">' +
				'	<span class="leader-icon">' +
				'		<svg xmlns="http://www.w3.org/2000/svg" focusable="false">' +
				'			<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#leader"></use>' +
				'		</svg>' +
				'	</span>' +
				'	<span class="nickname"></span>' +
				'</div>' +
				'<div class="heal-line"><div class="value"></div></div>' +
				'<div class="mana-line"><div class="value"></div></div>';

			document.querySelector('.group-list').appendChild(object);

			return object;
		}

		return objects[id];
	}

	return {
		current: current,
		update: update,
	};
})(menu);
