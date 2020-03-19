const formSearch = document.querySelector('.form-search'),

      inputCitiesFrom = document.querySelector('.input__cities-from'),
			dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
			
      inputCitiesTo = document.querySelector('.input__cities-to'),
			dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
			
			inputDateDepart = document.querySelector('.input__date-depart');
			
// Data

const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
	    proxy = 'https://cors-anywhere.herokuapp.com/',
			API_KEY = 'b6041c8c68e88b8dca922a9228f499cc',
			calendar = 'http://min-prices.aviasales.ru/calendar_preload'

let city = [];

let price = [];


//Functions

const getData = (url, callback) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {
		if (request.readyState !==4) return;

		if (request.status === 200) {
			callback(request.response);
		} else {
			console.error(request.status);
		}
	});
	request.send();
};


const showCity = (input, list) => {

	list.textContent = '';

	if (input.value !== '') {

		const filterCity = city.filter((item) => {
				const fixItem = item.name.toLowerCase();
				return fixItem.includes(input.value.toLowerCase());
		});
	
		filterCity.forEach((item) => {
			const li = document.createElement('li');
			li.classList.add('dropdown__city');
			li.textContent = item.name;
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

//Call Events

inputCitiesFrom.addEventListener('input', () => {
	showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
	clickInputCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
	clickInputCity(inputCitiesTo, dropdownCitiesTo);
});

//Call Functions

getData(proxy+citiesAPI, (data) => {
city = JSON.parse(data).filter((item => item.name));
console.log(city);
});

getData(calendar+'?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true', (data) => {
	price = JSON.parse(data);
	console.log(price);
})



 