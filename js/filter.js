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

function globalSearchHandler(e, dataToBeFiltered, inputs) {
	// console.log('************************');
	// console.log(e);
	// console.log(dataToBeFiltered);
	// console.log(inputs);

	tmpDataToBeFiltered = dataToBeFiltered;

	// Setting all items visible before we start to hide them
	tmpDataToBeFiltered.forEach(function(item) {
		item.visible = true;
		item.node.style.display = 'initial';
	});


	inputs.forEach(function(item) {
		// console.log('---------------I iterate---------------');
		if (item.tagName == 'INPUT') {
			if (item.getAttribute('type') == 'text') {
				tmpDataToBeFiltered = strSearchHandler(e, tmpDataToBeFiltered, item);
			} else if (item.getAttribute('type') == 'number' && item.getAttribute('data-from-value') === 'true') {
				// tmpDataToBeFiltered = numberSearchHandler(e, tmpDataToBeFiltered, item);
			}
		} else if (item.tagName == 'SELECT') {
			// call selectSearchHandler
		}
		// console.log('===');
		// console.log(item);
		// console.log('===');
	});

}

function strSearchHandler(e, dataToBeFiltered, input) {
	// console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	// console.log(e.srcElement.value);
	// console.log(e.srcElement.getAttribute('data-property-name'));

	typed = input.value;
	if (typed !== '') {
		dataToBeFiltered.forEach(function(item) {

			toBeFiltered = item.node.querySelector('.' + input.getAttribute('data-property-name'));
			
			if (toBeFiltered.innerHTML.toUpperCase().includes(typed.toUpperCase()) && item.visible) {
				item.node.style.display = 'initial';
				item.visible = true;
			} else {
				item.node.style.display = 'none';
				item.visible = false;
			}

		});
	}

	// console.log(dataToBeFiltered);
	// console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

	return dataToBeFiltered;
}



function selectSearchHandler(e, dataToBeFiltered) {
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
		inputs = [];
		for (var i = paramsObj.filterable.length - 1; i >= 0 ; i--) {
			currentFilter = paramsObj.filterable[i];

			tmpElements = [];

			if (currentFilter.type === 'str') {
				tmpElements.push({
					'element': createElementWAttr('input', {
															'type': 'text',
															'id': paramsObj.id + '_' + currentFilter.name,
															'data-property-name': currentFilter.name
														}),
					'callback': strSearchHandler,
					'dataToBeFiltered': filtered
			});
				
						// .addEventListener('input', typeHandler) // register for oninput
			} else if (currentFilter.type === 'num') {
				tmpElements.push({'element': createElementWAttr('input', {
											'type': 'number',
											'id': paramsObj.id + '_' + currentFilter.name + '_to',
											'data-property-name': currentFilter.name
										}),
									'callback': strSearchHandler,
									'dataToBeFiltered': filtered

			});
				tmpElements.push({'element': createElementWAttr('input', {
											'type': 'number',
											'id': paramsObj.id + '_' + currentFilter.name + '_from',
											'data-property-name': currentFilter.name,
											'data-from-value': 'true',
										}),
									'callback': strSearchHandler,
									'dataToBeFiltered': filtered

			});
			} else if (currentFilter.type === 'enumeration') {
				tmpEl = createElementWAttr('select', {
					'multiple': 'true',
					'name': paramsObj.id + '_' + currentFilter.name + '[]',
					'id': paramsObj.id + '_' + currentFilter.name,
					'data-property-name': currentFilter.name
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
				inputs.push(elem.element);
				
				document.getElementById(elem.element.id).addEventListener('input', (function(elem) {
					return function(e) {globalSearchHandler(e, elem.dataToBeFiltered, inputs);}
				}) (elem));
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
			'type': 'str'
		},
	]
});
