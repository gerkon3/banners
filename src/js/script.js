var decCache = [],
    decCases = [2, 0, 1, 1, 1, 2];

function decOfNum(number, titles) {
	if (!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
	return titles[decCache[number]];
}

var compareDate = new Date();
compareDate.setHours(compareDate.getHours() + 12);
compareDate.setMinutes(compareDate.getMinutes() + 12);
compareDate.setSeconds(compareDate.getSeconds() + 12);

setInterval(function(){
	timeBetweenDates(compareDate);
}, 1000);

function timeBetweenDates(toDate){
	var nowDate = new Date(),
			difference = compareDate.getTime() - nowDate.getTime();
    
	if (difference <= 0){
		document.getElementById('timer-time').innerHTML = "Акция закончена";
	} else {
  	var seconds = Math.floor(difference / 1000),
				minutes = Math.floor(seconds / 60),
				hours = Math.floor(minutes / 60);
				//days = Math.floor(hours / 24);
        
		hours %= 24;
		minutes %= 60;
		seconds %= 60;
        
		(hours<10) ? hours = '0' + hours : '';
		(minutes<10) ? minutes = '0' + minutes : '';
		(seconds<10) ? seconds = '0' + seconds : '';
        
		//document.getElementById('timer-v-days__text').innerHTML = decOfNum(hours, ['день', 'дня', 'дней']);
		document.getElementById('timer-hours-text').innerHTML = decOfNum(hours, ['час', 'часа', 'часов']);
		document.getElementById('timer-minutes-text').innerHTML = decOfNum(minutes, ['минута', 'минуты', 'минут']);
		document.getElementById('timer-seconds-text').innerHTML = decOfNum(seconds, ['секунда', 'секунды', 'секунд']);
		document.getElementById('timer-hours-number').innerHTML = hours;
		document.getElementById('timer-minutes-number').innerHTML = minutes;
		document.getElementById('timer-seconds-number').innerHTML = seconds;
	}
}

var app = new Vue({
	el: '#bannersApp',
	data: {
		windowWidth: window.innerWidth,
		isActive: false
	},
	methods: {
		screenResize: function(){
			if (this.windowWidth > 1199){
				this.isActive = false;
			} else {
				this.isActive = true;
			}
		}
	},
	mounted(){
		this.screenResize();
		window.addEventListener('resize', () => {
			this.windowWidth = window.innerWidth;
			this.checkWidth;
		});
	},
	computed: {
		checkWidth(){
			this.screenResize();
			this.windowWidth;
		}
	}
});