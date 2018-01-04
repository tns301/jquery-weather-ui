$(document).ready(function(){
	//Caching DOM elements
	var $rightMenu = $('#settings'),
			$rightButton = $('#btn-right'),
			$weatherMenu = $('#weather-menu'),
			$Main = $('#main'),
			$Central = $('#central'),
			$Info = $('#info-msg'),
			$InfoMsgBx = $('#info-msg .msg-box'),
			$tempDiv = $('#temp-div');
	
	var arrayThemes = ['green','turqoise','blue','purple'],
			randomTheme = Math.floor(Math.random() * 4),
			array_ID = ['#unit','#atm','#sun','#wind'],
			settingsList = $('#settings ul li, .search-container'),
			SettingsArray = [],
			info = {
				"Char":[
					"Invalid Characters!","Please use only letters! (aA-zZ)"
				],
				"Loc":[
					"Invalid Location","Please update your location!"
				],
				"Loading":[
					"Searching for location...","Location found!"
				],
				"Loading2":[
					"Saving, Please wait...","Save Complete!"
				],
				"GetDataError":[
					"Huston, we have a problem 🚀🌑","This city does not actually exist!"
				]
			};
	//End Caching DOM elements
	var currentSlide = 0,
			currentSlideX = [0,358,718],
			$dotmenu = $('#dotmenu span');
	var GetData = true,
			tmp_Location,
			LocalSettings,
			LoadedData;
	
	function WeatherIcon(d){
		let icon = "";
		
   		switch( parseInt(d) ) {
			case 0: 								icon = 'wi wi-tornado'; break;
			case 1: case 3: case 4: icon = 'wi wi-thunderstorm'; break;
			case 2: 								icon = 'wi wi-hurricane'; break;
			case 5: 								icon = 'wi wi-rain-mix'; break;
			case 6: case 7: 				icon = 'wi wi-sleet'; break;
			case 8: case 9: 				icon = 'wi wi-raindrops'; break;
			case 10: 								icon = 'wi wi-sprinkle'; break;
			case 11: case 12: 			icon = 'wi wi-showers'; break;
			case 13: case 14: 			icon = 'wi wi-snowflake-cold'; break;
			case 15: case 16: 			icon = 'wi wi-snow-wind'; break;
			case 17: 								icon = 'wi wi-hail'; break;
			case 18: 								icon = 'wi wi-sleet'; break;
			case 19: 								icon = 'wi wi-dust'; break;
			case 20: 								icon = 'wi wi-fog'; break;
			case 21: 								icon = 'wi wi-day-haze'; break;
			case 22: 								icon = 'wi wi-smog'; break;	
			case 23: 								icon = 'wi wi-strong-wind'; break;
			case 24: 								icon = 'wi wi-windy'; break;
			case 25: 								icon = 'wi wi-thermometer-exterior'; break;
			case 26:case 27:case 28:case 29:case 30:icon = 'wi wi-cloudy'; break;
			case 31: case 33:			  icon = 'wi wi-night-clear'; break;
			case 32: case 34:				icon = 'wi wi-day-sunny'; break;
			case 35: 								icon = 'wi wi-hail'; break;
			case 36: 								icon = 'wi wi-hot'; break;
			case 37:case 38:case 39:icon = 'wi wi-thunderstorm'; break;
			case 40: 								icon = 'wi wi-showers'; break;	
			case 41:case 42:case 43:icon = 'wi wi-snow'; break;
			case 44:  							icon = 'wi wi-cloudy'; break;
				
			default:								icon = 'wi wi-na';
   		}				
		return icon;
	}	
	function ApplyData(d){		
		// Location
		var $locspan = $('#location span'),
				$ctbicon = $('#ctbicon'),
				$ctb = $('#ctb'),
				$icontempi = $('#icon-temp i'),
				$icontempp = $('#icon-temp p');
		$locspan.text(d.location.city);
		
		// Central Info
		let currentTemp = d.item.condition.temp;
		let icon = WeatherIcon(d.item.condition.code);

		if (SettingsArray[0] == 1)
		{
			$ctbicon.text("°C");
		}
		else
		{
			$ctbicon.text("°F");
			currentTemp = (convertToF(currentTemp)).replace("°F",""); 
		}
		$ctb.text(currentTemp);
		$icontempi.removeClass().addClass(icon);
		$icontempp.text(d.item.condition.text);
		
		//Atmospheric Conditions
		var $atm = $('#atm'),
				$atmli = $('#atmli'),
				$hd = $('#hd'),
				$pd = $('#pd'),
				$vd = $('#vd');
		
		if ($atm.prop('checked') === true)
		{	
			$atmli.removeClass().addClass('aswshown');
			
			let pressure = d.atmosphere.pressure;
			let visib = d.atmosphere.visibility;

			if (SettingsArray[0] == 1)
			{
				pressure = parseFloat((pressure * 0.02953)/1.3332239).toFixed(2) + " mmHg";
				visib = parseFloat(visib).toFixed(2) + " " + d.units.distance;
			}
			else
			{
				pressure = parseFloat(pressure * 0.02953).toFixed(2) + " in";
				visib = convertToMiles(visib) + " mi";
			}
			$hd.text(d.atmosphere.humidity + "%");
			$pd.text(pressure);
			$vd.text(visib);
		}
		else
		{
			$atmli.removeClass().addClass('aswhidden');
		}
		//Sunrise/Sunset
		var $sun =  $('#sun'),
				$sunli = $('#sunli'),
				$srd = $('#srd'),
				$ssd = $('#ssd'),
				$td = $('#td');
		
		if ($sun.prop('checked') === true)
		{
			$sunli.removeClass().addClass('aswshown');
			let sunrise = d.astronomy.sunrise.replace(" am","").split(":");
			let sunset = d.astronomy.sunset.replace(" pm","").split(":");
			
			if (sunset[1].length < 2)
			{
				sunset[1] = "0" + sunset[1];
			}
			
			if (SettingsArray[0] == 1 )
			{
				if (sunrise[1] < 10){
					sunrise[1] = "0" + sunrise[1];
				}
				$srd.text(sunrise[0] + ":" + sunrise[1]);
				$ssd.text((parseInt(sunset[0]) + 12) + ":" + sunset[1]);
			}
			else
			{
				$srd.text(sunrise[0] + ":" + sunrise[1] + " am");
				$ssd.text( unset[0]+ ":" + sunset[1] + " pm");
			}
			let totalHours = (parseInt(sunset[0]) + 12) - parseInt(sunrise[0]);
			let minDif,
				sr = parseInt(sunrise[1]),
				ss = parseInt(sunset[1]);

			if (sr < ss){
				minDif = ss - sr;
				if (minDif < 10)
				{
					minDif = "0" + minDif;
				}
			}
			else
			{
				minDif = (60 - sr) + ss;
			}
			$td.text(totalHours + ":" + minDif);
		}
		else
		{
			$sunli.removeClass().addClass('aswhidden');
		}
		// Wind Conditions
		var $wind = $('#wind'),
				$windli = $('#windli'),
				$sd	=	$('#sd'),
				$cd	=	$('#cd'),
				$dd	=	$('#dd'),
				$directioni	=	$('#direction i');
		
		if ($wind.prop('checked') === true)
		{
			$windli.removeClass().addClass('aswshown');
			let speedWind = d.wind.speed,
					tempChillText = "",
					tempChill = d.wind.chill;
			
			if (SettingsArray[0] == 1)
			{
				speedWind = d.wind.speed + " km/h";
				tempChill = convertToC(tempChill);
			}
			else
			{
				speedWind = convertToMiles(speedWind) + " mph";
				tempChill += "°F"; 
			}

			let iconWind = "wi ";
			if (d.wind.direction >= 0 && d.wind.direction <= 90)
			{
				iconWind += "wi-direction-right";
			}
			else if (d.wind.direction > 90 && d.wind.direction <= 180)
			{
				iconWind += "wi-direction-up";
			}
			else if (d.wind.direction > 180 && d.wind.direction <= 270)
			{
				iconWind += "wi-direction-left";
			}
			else if (d.wind.direction > 270 && d.wind.direction <= 360)
			{
				iconWind += "wi-direction-down";
			}
			
			$sd.text(speedWind);
			$cd.text(tempChill);
			$directioni.removeClass().addClass(iconWind);
			$dd.text(d.wind.direction + "°");
		}
		else
		{
			$windli.removeClass().addClass('aswhidden');
		}
		
		// 9 Days forecast
		var $10days = $('.day10item');
		for (var item = 0; item < $10days.length; item++)
		{
			let CurrentDay = d.item.forecast[item + 1].day;
			let CurrentTemp = d.item.forecast[item + 1].high;
			let CurrentTempLow = d.item.forecast[item + 1].low;
			let CurrentIcon = WeatherIcon(d.item.forecast[item + 1].code);
			
			if (SettingsArray[0] == 1)
			{
				CurrentTemp += "°C";
				CurrentTempLow += "°C";
			}
			else
			{
				CurrentTemp = convertToF(CurrentTemp); 
				CurrentTempLow = convertToF(CurrentTempLow); 
			}
			
			$($10days[item]).find('i').removeClass().addClass(CurrentIcon);
			$($10days[item]).find('span').html(CurrentDay + "</br>" + CurrentTemp + " | " + CurrentTempLow);
		}
	}
	
	// Error Button Ok
	$('#info-msg').on('click','#ok-btn',function(e){
		if ($Info.hasClass('show'))
		{
			$Info.removeClass('show');
			$InfoMsgBx.removeClass('open');	
			
			setTimeout(function(){				
				$InfoMsgBx.find('#ok-btn').remove();	
			}, 1000);
		}
	});
	
	function UpdateErrorMsg(value, type){
		$Info.addClass('show');
		$InfoMsgBx.addClass('open');
		
		$InfoMsgBx.find('h1').text(info[value][0]);
		$InfoMsgBx.find('p').text(info[value][1]);

		if (type === 0)
		{
			$InfoMsgBx.append("<div id='ok-btn'>Ok</div>");
		}
		else
		{
			$InfoMsgBx.append("<div class='loader'></div>");
			$InfoMsgBx.find('p').addClass('hide');
			
			setTimeout(function(){	
				$InfoMsgBx.find('.loader').addClass('hide').remove();
				$InfoMsgBx.find('p').removeClass('hide').addClass('show, load');
				
				setTimeout(function(){
						$Info.removeClass('show');
						$InfoMsgBx.removeClass('open');
						$InfoMsgBx.find('p').removeAttr('class');
					}, 1000);
			}, 1750);
		}
	}
	
	function getWeather(Loc, ShowLoading){
		let querie = 'https://query.yahooapis.com/v1/public/yql?q=select units,astronomy,atmosphere,wind,location,item from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+ Loc +'") and u="c"&format=json';
		
  	$.getJSON(querie, function(data) {
			if (data.query.results === null)
			{ 
				UpdateErrorMsg("GetDataError", 0);
			}
			else
			{
				if (ShowLoading === true){
					UpdateErrorMsg("Loading", 1);
					SettingsArray[5] = tmp_Location;
				}
				LoadedData = data.query.results.channel;
				ApplyData(LoadedData);
			}
 		});
	}
	function toLocalStorage(){
		// Save to local storage
		LocalSettings = SettingsArray.toString();
		localStorage.setItem('SavedData', LocalSettings);
	}
	function LoadCheckboxSettings(){	
		// General Settings
		for (var i = 0; i < array_ID.length; i++)
		{
			if (SettingsArray[i] == '1')
			{
				 $(array_ID[i]).prop('checked',true);
			}
		}
		// Apply theme
		$Main.addClass(SettingsArray[SettingsArray.length-2] + " poor-Mozilla");
		$('span.' + SettingsArray[SettingsArray.length-2]).addClass('current');
	}
	function LoadLocalStorage(){
		LocalSettings = localStorage.getItem('SavedData');
		
		if (LocalSettings === null)
		{
			var Settings = '1,1,1,1,' + arrayThemes[randomTheme] + ',London';
			SettingsArray = Settings.split(',');

			getWeather('London', false);
			toLocalStorage();
		}
		else
		{
			SettingsArray = LocalSettings.split(',');
			getWeather(SettingsArray[SettingsArray.length-1], false);
		}
		
		LoadCheckboxSettings();
	}
	
	function LoadIntro(){
		$('#btn-right').css("display", "none");
		$('#weather-menu-btn').css("display", "none");
		
		$('#introscreen').addClass('sunloading');
		setTimeout(function(){
			$('#introscreen').addClass('animfin');
			
			$('#btn-right').removeAttr('style');
			$('#weather-menu-btn').removeAttr('style');
		}, 750);
		setTimeout(function(){
			$('#introscreen').remove();
		}, 1500);
		setTimeout(function(){
			$('#forget').addClass('hide');
		}, 7500);
	}
	function convertToF(temp){
		temp = (temp * 9 / 5 + 32).toFixed(0) + "°F";
		return temp;
	}
	function convertToC(temp){
		temp = (( temp - 32 )/( 9 / 5 )).toFixed(0) + "°C";
		return temp;
	}
	function convertToMiles(speed){
		speed = parseFloat(speed / 1.60934).toFixed(2);
		return speed;
	}
	// Update Checkbox
	$('input[type=checkbox]').on('change',function(e){
		let index = $( 'input[type=checkbox]' ).index(this);

		if ($(this).prop('checked'))
		{
			SettingsArray[index] = '1';
		}
		else
		{
			SettingsArray[index] = '0';
		}
	});
	
	// Open Settings Menu
	$('#main').on('click','#btn-right, #weather-menu-btn',function(e){
		e.preventDefault();
		var $CurrentButton = $(this);
		
		if ($CurrentButton.is("#btn-right"))
		{
			$rightButton.toggleClass('open');
			$rightMenu.toggleClass('show');
			
			$('body').removeAttr('class');
			
			if ($rightMenu.hasClass('show'))
			{
				$rightButton.prop('disabled', true);
				$Main.removeClass('poor-Mozilla');

				$('body').addClass(SettingsArray[4]);
				$(settingsList).each(function(j)
				{
					setTimeout(function () {
						$(settingsList[j]).addClass('slideAnimation'); 
					}, 35 * j);
				});

				setTimeout(function()
				{
					$rightButton.prop('disabled', false);
					$Main.addClass('poor-Mozilla');
				}, 595);	
			}
			else if ($rightMenu.hasClass(''))
			{
				$rightButton.prop('disabled', true);
				$Main.removeClass('poor-Mozilla');

				ApplyData(LoadedData);

				$('body').removeAttr('class');
				setTimeout(function()
				{
					$rightButton.prop('disabled', false);
						$(settingsList).each(function(j){
							$(this).removeClass('slideAnimation'); 
						});
					$Main.addClass('poor-Mozilla');
				}, 595);
			}
		}
		else if ($CurrentButton.is("#weather-menu-btn"))
		{
			$weatherMenu.toggleClass('show');
			
			if ($tempDiv.hasClass(''))
			{
				$tempDiv.addClass('weather-menu-show');
			}
			else
			{
				$tempDiv.removeClass('weather-menu-show');
			}
		}
		
	});
	
	// Change Theme
	$('.row').on('click','span',function(e){
		var new_theme = $(this).attr('class').split(' ');
		if (new_theme[1] != 'current')
		{
			$('.row span.' + SettingsArray[4]).removeClass('current');
			$(this).addClass('current');

			SettingsArray[4] = new_theme[0];
		}
		$Main.removeAttr('class').addClass(SettingsArray[4] + ' poor-Mozilla');
		$('body').removeAttr('class').addClass(SettingsArray[4]);
	});
	
	function isValid(string) {
		var char = '~`!#$%^&*+=[]\';,/{}|\":<>?@1234567890';
		for (var i = 0; i < string.length; i++)
		{
			if (char.indexOf(string.charAt(i)) != -1)
			{
				return false;
			}
		}
	}
	
	function checkBlank(string) {
		var count = 0;
		for (var i = 0; i < string.length; i++)
		{
			if (string[i] == " ")
			{
				count += 1;
			}
		}
		if (string.length == count || string.length <= 3)
		{ 
			return false; 
		}
	}

	// Update Button
	$('#settings').on('click','#update-button',function(e){
		tmp_Location = $('#search').val();
		
		if (tmp_Location === "")
		{
			tmp_Location = SettingsArray[5];
			GetData = true;
		}
		else
		{
			var CheckForInvalid = isValid(tmp_Location);
			var CheckForBlank = checkBlank(tmp_Location);

			if ($rightMenu.hasClass('show') && (CheckForInvalid === false || CheckForBlank === false))
			{			
				GetData = false; 
				UpdateErrorMsg("Char", 0);
			}
			else{				
				if (SettingsArray[5] != tmp_Location)
				{
					getWeather(tmp_Location, true);
					GetData = true;
				}
			}
		}
	});
	
	
	// Save button
	$('#settings').on('click','#save-button',function(e){		
		// Check if location is valid or not and add the info msg.
		if ($rightMenu.hasClass('show') && (GetData === false))
		{			
			UpdateErrorMsg("Loc", 0);
		}
		else
		{			
			UpdateErrorMsg("Loading2", 1);		
			toLocalStorage();
		}
	});
	
	$('#weather-menu').on('click','.day_left, .day_right, #dotmenu span',function(){
		var $button = $(this);
		
		if ($button.hasClass('day_right') && currentSlide != 2)
		{
			currentSlide += 1;
		 }
		else if ($button.hasClass('day_left') && currentSlide !== 0)
		{
			currentSlide -= 1;
		}
		else if ($button.hasClass(''))
		{
			var indexbtn = $button.index();
			currentSlide = indexbtn;
		}	

		$('.li_row').css('transform', 'translateX(-' + currentSlideX[currentSlide] + 'px)');
		$('.currentday').removeClass('currentday');
		$dotmenu.eq(currentSlide).addClass('currentday');
	});
	//End buttons
	
	LoadIntro();
	LoadLocalStorage();
	
	console.log("Hello there 😜");
}); // End $(document).ready