const formSearch = document.querySelector('.form-search'),

      inputCitiesFrom = document.querySelector('.input__cities-from'),
			dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
			
      inputCitiesTo = document.querySelector('.input__cities-to'),
			dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
			
      inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Moscow', 'Minsk', 'Karaganda', 'Chelabynsk',
							'Kerch', 'Volgograd', 'Samara', 'Dnepropetrovsk',
						'Yekaterinburg', 'Odessa', 'Riga', 'Ventspils', 'Uhan', 'Rostov-on-Don'];

const showCity = (input, list) => {

	list.textContent = '';

	if (input.value !== '') {

		const filterCity = city.filter((item) => {
			const fixItem = item.toLowerCase();
	
			return fixItem.includes(input.value.toLowerCase());
		});
	
		filterCity.forEach((item) => {
			const li = document.createElement('li');
			li.classList.add('dropdown__city');
			li.textContent = item;
			list.append(li)
		});
	}
};

const clickInputCity = (inputItem, dropdownItem) => {
	const target = event.target;

		if (target.tagName.toLowerCase() === 'li') {
			inputItem.value = target.textContent;
			dropdownItem.textContent = '';
	 	}
};

inputCitiesFrom.addEventListener('input', () => {
	showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
	clickInputCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
	clickInputCity(inputCitiesTo, dropdownCitiesTo);
});






 