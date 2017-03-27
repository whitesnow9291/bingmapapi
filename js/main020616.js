
jQuery(document).ready(function($) {
	// autocompletes
	//var autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('starting'));
    var autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('origin'));
    var autocomplete3 = new google.maps.places.Autocomplete(document.getElementById('destination'));

    var popup = $('#map-popup-wrap'),
    	popup2 = $('#map-popup-wrap-2');
    var showMapsPopup = function() {
    	$('#directions').hide();
    	$('#content1').hide();
    	$('#content2').hide();
    	$('#content3').hide();
    	$('body').css('overflow', 'hidden');
    	popup.show();
    	$('#content1').show().delay(2500).fadeOut('fast', function(){
			$('#content2').stop().fadeIn('normal');
    		$('#directions').show();
    		recenterPopup(popup2);
    	});
    };

    var recenterPopup = function(popup) {
    	var offset,
    		windowH = $(window).height(),
    		popupH  = popup.height();

    	if (windowH < popupH) {
    		offset = 50;
    	} else {
    		offset = (windowH - popupH) / 2;
    	}

    	popup.css('top', offset + 'px');
    };

    var hidePopup = function(popup) {
    	popup.fadeOut(function() {
    		$('body').css('overflow', 'auto');
    	});
    };

    var showPopup = function(popup) {
    	$('body').css('overflow', 'hidden');
    	popup.show();
    };

    // http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
    // correctly identifies MS Edge as not chrome
    var getBrowser = function() {
	    var ua= navigator.userAgent, tem,
	    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if(/trident/i.test(M[1])){
	        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
	        return 'IE '+(tem[1] || '');
	    }
	    if(M[1]=== 'Chrome'){
	        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
	        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	    }
	    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
	    return M.join(' ');
    };

    if (getBrowser().indexOf('Chrome') == -1) { // if not chrome
    	$('.link-chrome').hide();
    	$('.link-other').show().css('display', 'block');
    };

	var getRoute = function() {
		var start = document.getElementById('origin').value,
			end   = document.getElementById('destination').value;
		if (!start || !end) { return; }

		var map = new google.maps.Map(document.getElementById('mapDiv'), {}),
			directionsDisplay = new google.maps.DirectionsRenderer(),
			directionsService = new google.maps.DirectionsService(),
			transitDisplay    = new google.maps.DirectionsRenderer(),
			transitService    = new google.maps.DirectionsService();

	    directionsDisplay.setMap(map);
	    $('#driving-holder').html('');
	    $('#transit-holder').html('');
	    $('#content2').hide();
	    $('#driving-heading').hide();
	    $('#transit-heading').hide();
	    directionsDisplay.setPanel(document.getElementById('driving-holder'));
	    transitDisplay.setPanel(document.getElementById('transit-holder'));

		var drivingRequest = {
			origin:start,
			destination:end,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(drivingRequest, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				$('#driving-heading').show();
				directionsDisplay.setDirections(response);
			}
		});

		var transitRequest = {
			origin:start,
			destination:end,
			travelMode: google.maps.TravelMode.TRANSIT
		};
		transitService.route(transitRequest, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				$('#transit-heading').show();
				console.log(response);
				transitDisplay.setDirections(response);
			}
		});

		showMapsPopup();
	};

	$('#directions').hide();
	$('#map-wrap-1').height(($(window).height() - $('#top').outerHeight()) * 0.98);
	$('#ms-2').height($('#map-wrap-1').height());
	$('#map-view').height($('#map-sidebar').height());
	var mapOptions = {
		center: {lat: 39.4110629, lng: -99.264703},
		zoom: 4
	};
	var map = new google.maps.Map(document.getElementById('map-view'), mapOptions);

	$('#btnGetDirection').on('click', getRoute);
	//$('#btnGetLocation').on('click', getRoute); // disabled; need geoloc first

	// swap button
	$('#the-switch').click(function(){
		var t = $('#origin').val();
		$('#origin').val($('#destination').val());
		$('#destination').val(t);
	});

	// search again
	$('.again').on('click', function() {
		hidePopup(popup);
	});

	// info boxes
	var infoPopup = $('#infoPopup'),
		infoContent = $('#infoContent');
	$('.popup').on('click', function() {
		var name = $(this).attr('data-name');
		var content = $('#info-' + name).html();
		infoContent.html(content);
		showPopup(infoPopup);
	});
	$('#infoBox .close').on('click', function () {
		hidePopup(infoPopup);
	});

});


