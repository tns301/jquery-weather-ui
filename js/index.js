$(document).ready(function(){
	//Caching DOM elements
	var $RightMenu = $('#settings'),
			$RightButton = $('#btn-right'),
			$WeatherMenu = $('#weather-menu'),
			$Main = $('#main'),
			$Central = $('#central'),
			$Info = $('#info-msg'),
			$InfoMsgBx = $('#info-msg .msg-box'),
			$InfoMsgBxP = $('#info-msg .msg-box p'),
			$InfoMsgBxH1 = $('#info-msg .msg-box h1'),
			$DotMenu = $('#dotmenu span'),
			$TempDiv = $('#temp-div'),
			$LiRow = $('.li_row');
	
	var arrayThemes = ['green','turqoise','blue','purple'],
			randomTheme = Math.floor(Math.random() * 4),
			array_ID = ['#unit','#atm','#sun','#wind'],
			SettingsListLi = $('#settings ul li, .search-container'),
			SettingsArray = [],
			info = {
				"Char":[
					"Invalid Characters! 😡","Please use only letters! (aA-zZ) "
				],
				"Loc":[
					"Invalid Location 📍","Please update your location!"
				],
				"Loading":[
					"Searching for location...","Location found!"
				],
				"Loading2":[
					"Saving, Please wait...","Save Complete!"
				],
				"GetDataError":[
					"Huston, we have a problem 🚀🌑","This city doesn't exist!"
				],
				"NotEnoughCharacters":[
					"🏙️ Name is too short!","Please enter at least 4 letters"
				]
			};
	
	//End Caching DOM elements
	var CurrentSlide = 0,
			CurrentSlideX = [0,358,718],
			GetData = true,
			tmp_Location,
			LocalSettings,
			LoadedData;
		
	// Load Settings from Local Storage
	(function(){
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
		tmp_Location = SettingsArray[SettingsArray.length-1];
		
		loadCheckboxSettings();
		loadIntro();
		
		console.log("Hello there 😜");
	})();
	
	// --------- Start Functions ----------
		function getWeather(Loc, ShowLoading){
			let query = 'https://query.yahooapis.com/v1/public/yql?q=select units,astronomy,atmosphere,wind,location,item from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+ Loc +'") and u="c"&format=json';

			$.getJSON(query, function(data) {
				if (data.query.results === null)
				{ 
					updateErrorMsg("GetDataError", 0);
					tmp_Location = 'Not Found';
				}
				else
				{
					if (ShowLoading){
						updateErrorMsg("Loading", 1);
					}
					SettingsArray[SettingsArray.length - 1] = tmp_Location;

					LoadedData = data.query.results.channel;
					applyData(LoadedData);
				}
			});
		}
		function toLocalStorage(){
			// Save to local storage
			LocalSettings = SettingsArray.toString();
			localStorage.setItem('SavedData', LocalSettings);
		}
	
		function weatherIcon(d){
			let icon = "";

				switch(Math.floor(d)) {
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
		// Location
		var $locspan = $('#location span'),
				$datespan = $('#date span'),
				$ctbicon = $("#ctbicon"),
				$ctb = $("#ctb"),
				$icontempi = $('#icon-temp i'),
				$icontempp = $('#icon-temp p');
		//Atmospheric Conditions
		var $atm = $('#atm'),
				$atmli = $('#atmli'),
				$hd = $('#hd'),
				$pd = $('#pd'),
				$vd = $('#vd');
		//Sunrise/Sunset
		var $sun =  $('#sun'),
				$sunli = $('#sunli'),
				$srd = $('#srd'),
				$ssd = $('#ssd'),
				$td = $('#td');
		// Wind Conditions
		var $wind = $('#wind'),
				$windli = $('#windli'),
				$sd	=	$('#sd'),
				$cd	=	$('#cd'),
				$dd	=	$('#dd'),
				$directioni	=	$('#direction i');
		var $10days = $('.day10item');
	
		function applyData(d){
			//Location
			$locspan.text(d.location.city);
			
			let datespan = d.item.pubDate.split(" "), datespantext = "";
			for ( var date_i = 0; date_i < datespan.length - 3; date_i++ ){
				datespantext += " ";
				datespantext += datespan[date_i];
			}
			$datespan.text(datespantext);
			
			// Central Info
			let currentTemp = d.item.condition.temp;
			let icon = weatherIcon(d.item.condition.code);

			if (SettingsArray[0] == 1)
			{
				$ctbicon.text(" ºC");
			}
			else
			{
				$ctbicon.text(" ºF");
				currentTemp = (convertToF(currentTemp)).replace(" ºF",""); 
			}
			$ctb.text(currentTemp);
			$icontempi.removeClass().addClass(icon);
			$icontempp.text(d.item.condition.text);
			
			// Atmospheric
			if ($atm.prop('checked') === true)
			{	
				$atmli.removeClass().addClass('aswshown');

				let pressure = d.atmosphere.pressure;
				let visib = d.atmosphere.visibility;

				if (SettingsArray[0] == 1)
				{
					pressure = Math.round((pressure * 0.02953)/1.3332239)+ " mmHg";
					visib =  Math.round(visib) + " " + d.units.distance;
				}
				else
				{
					pressure =  Math.round(pressure * 0.02953) + " in";
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
			
			// Sunrise/Sunset
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
					$ssd.text((Math.floor(sunset[0]) + 12) + ":" + sunset[1]);
				}
				else
				{
					$srd.text(sunrise[0] + ":" + sunrise[1] + " am");
					$ssd.text(sunset[0]+ ":" + sunset[1] + " pm");
				}
				
				var hours = 12;
				
				if(sunset[0] >= sunrise[0])
				{
					 hours = 11;
				}

				let totalHours = (Math.floor(sunset[0]) + hours) - Math.floor(sunrise[0]);
				let minDif,
						sr = Math.floor(sunrise[1]), // Store the minutes for sunrise
						ss = Math.floor(sunset[1]);  // Store the minutes for sunset
				
				if (sr < ss){
					minDif = ss - sr;
				}
				else
				{
					minDif = (60 - sr) + ss;
				}

				if (minDif < 10)
				{
					minDif = "0" + minDif;
				}
				else if ( minDif == 60){
					minDif = "00";
				} 

				$td.text(totalHours + ":" + minDif);
			}
			else
			{
				$sunli.removeClass().addClass('aswhidden');
			}
			
			// Wind
			if ($wind.prop('checked') === true)
			{
				$windli.removeClass().addClass('aswshown');
				let speedWind = d.wind.speed,
						tempChillText = "",
						tempChill = d.wind.chill;

				if (SettingsArray[0] == 1)
				{
					speedWind = Math.round(d.wind.speed) + " km/h";
					tempChill = convertToC(tempChill);
				}
				else
				{
					speedWind = convertToMiles(speedWind) + " mph";
					tempChill += " ºF"; 
				}

				let iconWind = "";
				if (d.wind.direction >= 0 && d.wind.direction <= 90)
				{
					iconWind = "fa fa-long-arrow-right";
				}
				else if (d.wind.direction > 90 && d.wind.direction <= 180)
				{
					iconWind = "fa fa-long-arrow-up";
				}
				else if (d.wind.direction > 180 && d.wind.direction <= 270)
				{
					iconWind = "fa fa-long-arrow-left";
				}
				else if (d.wind.direction > 270 && d.wind.direction <= 360)
				{
					iconWind = "fa fa-long-arrow-down";
				}

				$sd.text(speedWind);
				$cd.text(tempChill);
				$directioni.removeClass().addClass(iconWind);
				$dd.text(d.wind.direction + " º");
			}
			else
			{
				$windli.removeClass().addClass('aswhidden');
			}

			// 9 Days forecast
			for (var item = 0; item < $10days.length; item++)
			{
				let CurrentDay = d.item.forecast[item + 1].day;
				let CurrentTemp = d.item.forecast[item + 1].high;
				let CurrentTempLow = d.item.forecast[item + 1].low;
				let CurrentIcon = weatherIcon(d.item.forecast[item + 1].code);

				if (SettingsArray[0] == 1)
				{
					CurrentTemp += " ºC";
					CurrentTempLow += " ºC";
				}
				else
				{
					CurrentTemp = convertToF(CurrentTemp); 
					CurrentTempLow = convertToF(CurrentTempLow); 
				}

				$($10days[item]).find('i').removeClass().addClass(CurrentIcon);
				$($10days[item]).find('span').html(CurrentDay + "</br><i>" + CurrentTemp + " <strong>/</strong> " + CurrentTempLow + "</i>");
			}
		}
		function loadCheckboxSettings(){	
			// General Settings
			for (var i = 0; i < array_ID.length; i++)
			{
				if (SettingsArray[i] == '1')
				{
					 $(array_ID[i]).prop('checked',true);
				}
			}
			// Apply theme
			$Main.addClass(SettingsArray[SettingsArray.length-2] + ' poor-Mozilla');
			$('span.' + SettingsArray[SettingsArray.length-2]).addClass('current');
		}
		function loadIntro(){
			$('#btn-right').css('display','none');
			$('#weather-menu-btn').css("display", "none");

			$('#introscreen').addClass('sunloading');
			setTimeout(function(){
				$('#introscreen').addClass('animfin');

				$('#btn-right').removeAttr('style');
				$('#weather-menu-btn').removeAttr('style');
			}, 650);
			setTimeout(function(){
				$('#introscreen').remove();
			}, 1350);
			
			setTimeout(function(){
				$('#forget').addClass('hide');
			}, 7500);
		}
		function convertToF(temp){
			return Math.round(temp * 9 / 5 + 32) + ' ºF';
		}
		function convertToC(temp){
			return Math.round((temp - 32)/(9 / 5)) + ' ºC';
		}
		function convertToMiles(speed){
			return Math.round(speed / 1.60934);
		}
	
	// --------- Start Function Buttons -----------
		// Update Checkbox
		$('input[type=checkbox]').on('change', function(e){
			let index = $('input[type=checkbox]').index(this);

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
		$('#main').on('click','#btn-right, #weather-menu-btn', function(e){
			e.preventDefault();
			var $CurrentButton = $(this);

			if ($CurrentButton.is('#btn-right'))
			{
				$RightButton.toggleClass('open');
				$RightMenu.toggleClass('show');

				$('body').removeAttr('class');

				if ($RightMenu.hasClass('show'))
				{
					$RightButton.prop('disabled', true);
					$Main.removeClass('poor-Mozilla');

					$('body').addClass(SettingsArray[4]);
					
					for (var ii = 0; ii < SettingsListLi.length; ii++){
						AnimiateLiMenu(ii, SettingsListLi[ii], 0);
					}

					setTimeout(function()
					{
						$RightButton.prop('disabled', false);
						$Main.addClass('poor-Mozilla');
					}, 595);	
				}
				else if ($RightMenu.hasClass(''))
				{
					$RightButton.prop('disabled', true);
					$Main.removeClass('poor-Mozilla');
					
					if (LoadedData != null){
						applyData(LoadedData);
					}

					$('body').removeAttr('class');
					setTimeout(function()
					{
						$RightButton.prop('disabled', false);
						for (var ii = 0; ii < SettingsListLi.length; ii++){
							AnimiateLiMenu(ii, SettingsListLi[ii], 1);
						}
						$Main.addClass('poor-Mozilla');
					}, 595);
				}
			}
			else if ($CurrentButton.is('#weather-menu-btn'))
			{
				$WeatherMenu.toggleClass('show');

				if ($TempDiv.hasClass(''))
				{
					$TempDiv.addClass('weather-menu-show');
				}
				else
				{
					$TempDiv.removeClass('weather-menu-show');
				}
			}

			function AnimiateLiMenu(Step, currentLi, AddRemove) {
				if (AddRemove === 0){
					setTimeout(function() {
						$(currentLi).addClass('slideAnimation'); 
					}, Step * 35);
				}
				else{
					$(currentLi).removeClass('slideAnimation');
				}
				
			}
			
		});

		// Error Button
		$('#info-msg').on('click','#ok-btn', function(e){
			if ($Info.hasClass('show'))
			{
				$Info.removeClass('show');
				$InfoMsgBx.removeClass('open');	

				setTimeout(function(){				
					$InfoMsgBx.find('#ok-btn').remove();	
				}, 1000);
			}
		});	
		
		function updateErrorMsg(value, type){
			$Info.addClass('show');
			
			$InfoMsgBx.addClass('open');
			$InfoMsgBxH1.text(info[value][0]);
			$InfoMsgBxP.text(info[value][1]);

			if (type === 0)
			{
				$InfoMsgBx.append("<div id='ok-btn'>Ok</div>");
			}
			else
			{
				$InfoMsgBx.append("<div class='loader'></div>");
				$InfoMsgBxP.addClass('hide');

				setTimeout(function(){	
					$InfoMsgBx.find('.loader').addClass('hide').remove();
					$InfoMsgBxP.removeClass('hide').addClass('show, load');

					setTimeout(function(){
							$Info.removeClass('show');
							$InfoMsgBx.removeClass('open');
							setTimeout(function(){
							 $InfoMsgBxP.removeAttr('class');
						  }, 500);
						}, 1250);
				}, 1750);
			}
		}
		// End Error Button

		// Change Theme
		$('.row').on('click','span', function(e){
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

		// Update Button
		function isValid(string) {
			var char = '~`!#$%^&*+=[]\';,/{}|\":<>?@1234567890';
			for (var i = 0; i < string.length; i++)
			{
				if (char.indexOf(string.charAt(i)) != -1)
				{
					return false;
				}
			}
			return true;
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
			else
			{
				return true;
			}
		}

		$('#settings').on('click','#update-button', function(e){
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

				if ($RightMenu.hasClass('show') && (!CheckForInvalid || !CheckForBlank))
				{			
					GetData = false;
					
					if (!CheckForBlank)
					{
						updateErrorMsg('NotEnoughCharacters', 0);
					}
					else
					{
						updateErrorMsg('Char', 0);
					}
				}
				else
				{				
					if (SettingsArray[5] != tmp_Location)
					{
						getWeather(tmp_Location, true);
						GetData = true;
					}
				}
			}
		});
		// End Update Button

		// Save button
		$('#settings').on('click','#save-button', function(e){		
			// Check if location is valid or not and add the info msg.
			if ($RightMenu.hasClass('show') && (GetData === false))
			{			
				updateErrorMsg('Loc', 0);
			}
			else
			{			
				updateErrorMsg('Loading2', 1);		
				toLocalStorage();
			}
		});

		// Dot Menu
		$('#weather-menu').on('click','.day_left, .day_right, #dotmenu span', function(){
			var $button = $(this);
			var $currentDay = $('#dotmenu .currentday');

			if ($button.hasClass('day_right') && CurrentSlide != 2)
			{
				CurrentSlide += 1;
			 }
			else if ($button.hasClass('day_left') && CurrentSlide !== 0)
			{
				CurrentSlide -= 1;
			}
			else if ($button.hasClass(''))
			{
				var indexbtn = $button.index();
				CurrentSlide = indexbtn;
			}	

			$LiRow.css('transform', 'translateX(-' + CurrentSlideX[CurrentSlide] + 'px)');
			$currentDay.removeClass('currentday');
			$DotMenu.eq(CurrentSlide).addClass('currentday');
		});
	
	//----------- End Function Buttons -----------
	//----------- End Function -----------
	
}); // End $(document).ready