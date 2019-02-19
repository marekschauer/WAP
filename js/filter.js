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

function strSearchHandler(e, dataToBeFIltered) {
	console.log('************************');
	console.log(e.srcElement.value);
	console.log(dataToBeFIltered);
}

function selectSearchHandler(e, dataToBeFIltered) {
	for (var i = this.selectedOptions.length - 1; i >= 0; i--) {
		console.log(this.selectedOptions[i].value);
	}
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

	let filtered = [];
	for (var i = 0; i < selected.length; i++) {
		filtered.push({
			'node': selected[i],
			'visible': true
		});
	}
	console.log(filtered);

	if (paramsObj.filterable.length > 0) {
		form = createElementWAttr('form', {});
		for (var i = paramsObj.filterable.length - 1; i >= 0 ; i--) {
			currentFilter = paramsObj.filterable[i];

			tmpElements = [];

			if (currentFilter.type === 'str') {
				tmpElements.push({
					'element': createElementWAttr('input', {
															'type': 'text',
															'id': paramsObj.id + '_' + currentFilter.name
														}),
					'callback': strSearchHandler,
					'dataToBeFiltered': filtered
			});
				
						// .addEventListener('input', typeHandler) // register for oninput
			} else if (currentFilter.type === 'num') {
				tmpElements.push({'element': createElementWAttr('input', {
											'type': 'number',
											'id': paramsObj.id + '_' + currentFilter.name + '_from'
										}),
									'callback': strSearchHandler,
									'dataToBeFiltered': filtered

			});
				tmpElements.push({'element': createElementWAttr('input', {
											'type': 'number',
											'id': paramsObj.id + '_' + currentFilter.name + '_to'
										}),
									'callback': strSearchHandler,
									'dataToBeFiltered': filtered

			});
			} else if (currentFilter.type === 'enumeration') {
				tmpEl = createElementWAttr('select', {
					'multiple': 'true',
					'name': paramsObj.id + '_' + currentFilter.name + '[]',
					'id': paramsObj.id + '_' + currentFilter.name
				});

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
				tmpElements.push({'element': tmpEl, 'callback': selectSearchHandler});
			}
			
			tmpElements.forEach(function(elem) {
				filterable_content.prepend(elem.element);
				
				// console.log('------------------------------');
				document.getElementById(elem.element.id).addEventListener('input', (function(elem) {
					return function(e) {elem.callback(e, elem.dataToBeFiltered);}
				}) (elem));



				// document.getElementById(elem.element.id).addEventListener('input', elem.callback);
			});
		}
	}
}

initFilter({
	'id': 'wap_filterable',
	'filterable': [
		{
			'name': 'title',
			'type': 'str',
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

// initFilter({
// 	'id': 'wap_filterable2',
// 	'filterable': [
// 		{
// 			'name': 'title',
// 			'type': 'str',
// 		},
// 		{
// 			'name': 'price',
// 			'type': 'num'
// 		},
// 		{
// 			'name': 'author',
// 			'type': 'str'
// 		},
// 		{
// 			'name': 'quantity',
// 			'type': 'num'
// 		},
// 		{
// 			'name': 'publisher',
// 			'type': 'enumeration'
// 		},
// 	]
// });
