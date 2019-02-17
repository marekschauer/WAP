/**
 * Creates an element with attribute.
 *
 * @param      string	element     The element
 * @param      object 	attributes  The attributes
 * @return     An Element object, which represents the created Element node
 */
function createElementWAttr(element, attributes) {
	newElement = document.createElement(element);
	for (var i = 0; i < Object.keys(attributes).length; i++) {
		key = Object.keys(attributes)[i];
		newElement.setAttribute(key, attributes[key]);
	}
	return newElement;
}

/**
 * Initializes filter of items
 *
 * @param      object  paramsObj	The object that holds parameters
 * 									                     
 */
function initFilter(paramsObj) {
	selected = document.getElementById(paramsObj.id).getElementsByClassName('item');
	filterable_content = document.getElementById(paramsObj.id);

	for (var i = paramsObj.filterable.length - 1; i >= 0 ; i--) {
		currentFilter = paramsObj.filterable[i];

		if (currentFilter.type === 'str') {
			tmpEl = createElementWAttr('input', {
						'type': 'text'
					});
		} else if (currentFilter.type === 'num') {
			tmpEl = createElementWAttr('input', {
						'type': 'number'
					});
		} else if (currentFilter.type === 'enumeration') {
			tmpEl = createElementWAttr('select', {'multiple': 'true'});

			selected = filterable_content.getElementsByClassName('item')/*.getElementsByClassName(currentFilter.name)*/;
			selected = document.querySelectorAll("#" + paramsObj.id + " .item ." + currentFilter.name);
			uniqueOptions = [];
			selected.forEach(function(currentValue, currentIndex, listObj) {
				if (!uniqueOptions.includes(currentValue.innerHTML)) {
					tmpOption = createElementWAttr('option', {
						'value': selected[currentIndex].innerHTML
					});
					tmpOption.innerHTML = currentValue.innerHTML;
					tmpEl.append(tmpOption);
					uniqueOptions.push(currentValue.innerHTML);
				}
			});
			console.log(selected);
		}
		filterable_content.prepend(tmpEl);
	}
}

initFilter({
	'id': 'wap_filterable',
	'filterable': [
		{
			'name': 'title',
			'type': 'str'
		},
		{
			'name': 'price',
			'type': 'num'
		},
		{
			'name': 'author',
			'type': 'str'
		},
		{
			'name': 'quantity',
			'type': 'num'
		},
		{
			'name': 'publisher',
			'type': 'enumeration'
		},
	]
});
