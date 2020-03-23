const formSearch = document.querySelector('.form-search'),

      inputCitiesFrom = document.querySelector('.input__cities-from'),
			dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
			
      inputCitiesTo = document.querySelector('.input__cities-to'),
			dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
			
			inputDateDepart = document.querySelector('.input__date-depart'),
			cheapestTicket = document.getElementById('cheapest-ticket'),
			otherCheapTickets = document.getElementById('other-cheap-tickets');
			
// Data

const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
	    proxy = 'https://cors-anywhere.herokuapp.com/',
			API_KEY = 'b6041c8c68e88b8dca922a9228f499cc',
			calendar = 'http://min-prices.aviasales.ru/calendar_preload',
			MAX_COUNT = 10;

let city = [];

let price = [];


//Functions

const getData = (url, callback, reject = console.error) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {
		if (request.readyState !==4) return;

		if (request.status === 200) {
			callback(request.response);
		} else {
			reject(request.status);
		}
	});
	request.send();
};


const showCity = (input, list) => {

	list.textContent = '';

	if (input.value !== '') {

		const filterCity = city.filter((item) => {
				const fixItem = item.name.toLowerCase();
				return fixItem.startsWith(input.value.toLowerCase());
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

const getChanges = (num) => {
	if (num) {
		return num === 1 ? '1 Change' : '2 changes';
	} else {
		return 'No Changes'
	}
};

const getLinkAviasales = (data) => {
	let link = 'https://www.aviasales.ru/search';
	link += data.origin

	const date = new Date(data.depart_date);
	
	const day = date.getDate();

	link += day < 10 ? '0' + day : day;
	const month = date.getMonth() + 1;

	link += month < 10 ? '0' + month : month; 
	link += data.destination;

	link += '1';

	console.log('link: ', link);
	
	return link;
};

const getNameCity = (code) => {
	const objCity = city.find((item) => item.code === code);
	return objCity.name;
};

const getDate = (date) => {
	return new Date(date).toLocaleString('lv', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};

const createCard = (data) => {
 const ticket = document.createElement('article');
 ticket.classList.add('ticket');

 let deep = '';

if(data) {
	deep = `
	<h3 class="agent">${data.gate}</h3>
	<div class="ticket__wrapper">
	<div class="left-side">
		<a href="${getLinkAviasales(data)} target ="_blank" " class="button button__buy">Купить
			за ${data.value}₽</a>
	</div>
	<div class="right-side">
		<div class="block-left">
			<div class="city__from">Вылет из города
				<span class="city__name">${getNameCity(data.origin)}</span>
			</div>
			<div class="date">${getDate(data.depart_date)}</div>
		</div>

		<div class="block-right">
			<div class="changes">${getChanges(data.number_of_changes)}</div>
			<div class="city__to">Город назначения:
				<span class="city__name">${getNameCity(data.destination)}</span>
			</div>
		</div>
	</div>
</div>
	`;
} else {
	deep = '<h3>There are no tickets on selected date!</h3>'
}

 ticket.insertAdjacentHTML('afterbegin', deep);
 return ticket;
};

const renderCheapDay = (cheapTicket) => {
	cheapestTicket.style.display = 'block';
	cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
	
	const ticket = createCard(cheapTicket[0]);
	cheapestTicket.append(ticket);
	
};

const renderCheapYear = (cheapTickets) => {
	otherCheapTickets.style.display = 'block';
	otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
	
	cheapTickets.sort( (a, b) => a.value - b.value);
		
		for (let i = 0; i < cheapTickets.lenght && i < MAX_COUNT; i++) {
			const ticket = createCard(cheapTickets[i]);
			otherCheapTickets.append(ticket);
		}

	console.log(cheapTickets);
};

const renderCheap = (data, date) => {
	const cheapTicketYear = JSON.parse(data).best_prices;

	const cheapTicketDay = 	cheapTicketYear.filter((item) => {
		return	item.depart_date === date;
	})

	renderCheapDay(cheapTicketDay);
	renderCheapYear(cheapTicketYear);
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

formSearch.addEventListener('submit', (event) => {
	event.preventDefault();

	//debugger;

	const cityFrom = city.find((item) => {
		return inputCitiesFrom.value === item.name
	});
	const cityTo = city.find((item) => {
		return inputCitiesTo.value === item.name
	});

	const formData = {
		from: cityFrom,
		to: cityTo,
		when: inputDateDepart.value
	};

	if(formData.from && formData.to) {
		const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

		getData(calendar + requestData, (response) => {
			renderCheap(response, formData.when);
	});
	
	} else {
		alert('Enter correct city Name!')
	}
});

//Call Functions

getData(proxy+citiesAPI, (data) => {
city = JSON.parse(data).filter((item => item.name));

city.sort((a, b) => {
	if (a.name > b.name) {
	  return 1;
	}
	if (a.name < b.name) {
	  return -1;
	}
	return 0;
  });
//console.log(city);
});

// getData(proxy + calendar +'?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true&token=' + API_KEY, (data) => {
// 	price = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-29');
// 	console.log(price);
// })



 