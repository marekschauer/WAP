/*
****************************************
****************************************
 * WAP Project - Výběr zboží
 * Javascript filter of items
 * 
 * Author: Marek Schauer
 * Academic year: 2018/2019
****************************************
****************************************
 */

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
 * Gets the selected options of given select.
 *
 * @param      HTMLElement  select  The select to be viewed
 * @return     Array	    The array of selected options.
 */
function getSelectedOptionsValues(select) {
	toBeReturned = [];
	for (var i = 0; i < select.options.length; i++) {
		if (select.options[i].selected) {
			toBeReturned.push(select.options[i].value);
		}
	}
	console.log(toBeReturned);
	return toBeReturned;
}

/**
 * Search handler for all types of inputs, calls particular
 * handlers depending on inputs that occur in filter
 *
 * @param      InputEvent  	e                 Event of input which fired an event
 * @param      Array  		dataToBeFiltered  The data to be filtered
 */
function globalSearchHandler(e, dataToBeFiltered) {
	tmpDataToBeFiltered = dataToBeFiltered;

	// Setting all items visible before we start to hide them
	tmpDataToBeFiltered.forEach(function(item) {
		item.visible = true;
		item.node.style.removeProperty('display');
	});

	scope = e.srcElement.getAttribute('data-filter-id');
	inputs = document.querySelectorAll('[data-filter-id="' + scope + '"]');


	inputs.forEach(function(item) {
		if (item.tagName == 'INPUT') {
			if (item.getAttribute('type') == 'text') {
				tmpDataToBeFiltered = strSearchHandler(e, tmpDataToBeFiltered, item);
			} else if (item.getAttribute('type') == 'number' && item.getAttribute('data-from-value') === 'true') {
				tmpDataToBeFiltered = numberSearchHandler(e, tmpDataToBeFiltered, item);
			}
		} else if (item.tagName == 'SELECT') {
			tmpDataToBeFiltered = selectSearchHandler(e, tmpDataToBeFiltered, item);
		}
		
	});

}

/**
 * Search handler for strings
 *
 * @param      InputEvent  	e                 Event of input which fired an event
 * @param      Array  		dataToBeFiltered  The data to be filtered
 * @param      Object 		input             The input that holds the value we search for
 * @return     Array 		Array of data filtered by string contained in input
 */
function strSearchHandler(e, dataToBeFiltered, input) {
	typed = input.value;

	if (typed !== '') {
		dataToBeFiltered.forEach(function(item) {

			toBeFiltered = item.node.querySelector('.' + input.getAttribute('data-property-name'));
			
			if (toBeFiltered.innerHTML.toUpperCase().includes(typed.toUpperCase()) && item.visible) {
				item.node.style.removeProperty('display');
				item.visible = true;
			} else {
				item.node.style.display = 'none';
				item.visible = false;
			}

		});
	}

	return dataToBeFiltered;
}

/**
 * Search handler for strings
 *
 * @param      InputEvent  	e                 Event of input which fired an event
 * @param      Array  		dataToBeFiltered  The data to be filtered
 * @param      Object 		input             The input that holds the 'from' value we search for
 * @return     Array 		Array of data filtered by numerical interval given by input
 */
function numberSearchHandler(e, dataToBeFiltered, input) {
	interval = {
		'from': Number.MIN_SAFE_INTEGER,
		'to': Number.MAX_SAFE_INTEGER
	};
	inputFrom = input.value;
	interval.from = input.value === "" ? Number.MIN_SAFE_INTEGER : parseInt(input.value,10);
	inputId = input.getAttribute('id');
	toValue = document.getElementById(inputId.substr(0, inputId.length-5) + '_to').value;
	interval.to = toValue === "" ? Number.MAX_SAFE_INTEGER : parseInt(toValue, 10);
	

	dataToBeFiltered.forEach(function(item) {

		toBeFiltered = item.node.querySelector('.' + input.getAttribute('data-property-name'));
		
		if (item.visible && parseInt(toBeFiltered.innerHTML, 10) >= parseInt(interval.from, 10) && parseInt(toBeFiltered.innerHTML, 10) <= parseInt(interval.to, 10)) {
			item.node.style.removeProperty('display');
			item.visible = true;
		} else {
			item.node.style.display = 'none';
			item.visible = false;
		}

	});

	return dataToBeFiltered;
}


/**
 * Search handler for enumeration
 *
 * @param      InputEvent  	e                 Event of select which fired an event
 * @param      Array  		dataToBeFiltered  The data to be filtered
 * @param      Object 		select            The select that holds the selected options
 * @return     Array 		Array of data filtered by selected options
 */
function selectSearchHandler(e, dataToBeFiltered, select) {
	selectedOptions = getSelectedOptionsValues(select);

	if (selectedOptions.length != 0) {
		dataToBeFiltered.forEach(function(item) {
			toBeFiltered = item.node.querySelector('.' + select.getAttribute('data-property-name'));
			if (item.visible && selectedOptions.includes(toBeFiltered.innerHTML)) {
				item.node.style.removeProperty('display');
				item.visible = true;
			} else {
				item.node.style.display = 'none';
				item.visible = false;
			}
		});
	}

	return dataToBeFiltered;
}

/**
 * Initializes filter of items and creates inputs
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

	if (paramsObj.filterable.length > 0) {
		for (var i = paramsObj.filterable.length - 1; i >= 0 ; i--) {
			currentFilter = paramsObj.filterable[i];

			tmpElements = [];

			if (currentFilter.type === 'str') {
				tmpElements.push({
					'element': createElementWAttr('input', {
															'type': 'text',
															'id': paramsObj.id + '_' + currentFilter.name,
															'data-property-name': currentFilter.name,
															'data-filter-id': paramsObj.id,
															'placeholder': currentFilter.form_placeholder
														}),
					'dataToBeFiltered': filtered
			});
				
			} else if (currentFilter.type === 'num') {
				tmpElements.push({'element': createElementWAttr('input', {
											'type': 'number',
											'id': paramsObj.id + '_' + currentFilter.name + '_to',
											'data-property-name': currentFilter.name,
											'data-filter-id': paramsObj.id,
											'placeholder': currentFilter.form_placeholder[1]
										}),
									'dataToBeFiltered': filtered

			});
				tmpElements.push({'element': createElementWAttr('input', {
											'type': 'number',
											'id': paramsObj.id + '_' + currentFilter.name + '_from',
											'data-property-name': currentFilter.name,
											'data-filter-id': paramsObj.id,
											'data-from-value': 'true',
											'placeholder': currentFilter.form_placeholder[0]
										}),
									'dataToBeFiltered': filtered

			});
			} else if (currentFilter.type === 'enumeration') {
				tmpEl = createElementWAttr('select', {
					'multiple': 'true',
					'name': paramsObj.id + '_' + currentFilter.name + '[]',
					'id': paramsObj.id + '_' + currentFilter.name,
					'data-property-name': currentFilter.name,
					'data-filter-id': paramsObj.id,
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
				tmpElements.push({
					'element': tmpEl,
					'dataToBeFiltered': filtered
				});
			}
			
			tmpElements.forEach(function(item) {
				filterable_content.prepend(item.element);
				
				document.getElementById(item.element.id).addEventListener('input', (function(foo) {
					return function(e) {
						globalSearchHandler(e, foo.dataToBeFiltered);
					}
				}) (item));
			});
		}
	}
}
