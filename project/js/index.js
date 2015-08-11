jQuery(function() {
    var page = jQuery('body').attr('id'), nav = jQuery('#nav'), searchbox = jQuery('#searchbox'), closer = jQuery('#close-arr'), contactbox = jQuery('#contact-box'), contactshow = jQuery('#contact-show');
    if (page == 'mainpage') {
        var news = jQuery('#news'), footer = jQuery('#footer'), 
            logo = jQuery('#logo'), slides = jQuery('#slides'), 
            showTimer = 500;
            
        hideAll();
        showNav();
        setTimeout(showNews, showTimer * 1.5);
        setTimeout(showFoot, showTimer);
        setTimeout(showSlides, showTimer * 2);
    }
    if (page == 'page404') { startPaper(); }
    if (page == 'contacts-page') { contactsPage(); }
    if (page == 'catalog-page') { catalogPage(); }
	    
    searchbox.click(function(){
        if (!searchbox.hasClass('searchbox-clicked')) {
            searchbox.addClass('searchbox-clicked');
            setTimeout(function(){ jQuery(searchbox.children('form')[0]).fadeIn('fast'); }, 500);
        }
    });
    closer.click(function(){
        if (searchbox.hasClass('searchbox-clicked')) {
            jQuery(searchbox.children('form')[0]).fadeOut('fast');
            setTimeout(function(){ searchbox.removeClass('searchbox-clicked'); }, 500);
        }
    });
    
    var showOrHide = true;
    contactshow.click(function() {        
        if (showOrHide === true) {
            contactbox.slideDown('fast');
            showOrHide = false;
        } else {
            contactbox.slideUp('fast');
            showOrHide = true;
        }
    });
    
	function hideAll() {
        nav.css('top', '-50px');
        footer.css('bottom', '-40px');
        news.css('left', '100%');
    }
	function showNav() {
		nav.animate({ 'top': 0 }, showTimer);
	}	
	function showLogo() {
		logo.animate({ 'left': 0 }, showTimer);
	}	
	function showNews() {
		news.animate({ 'left': 0 }, showTimer);
	}	
	function showFoot() {
		footer.animate({ 'bottom': 0 }, showTimer);
	}	
	function showSlides() {
		jQuery('#mainpage').addClass('transparent');
		setTimeout(actionSlider('#slides'), showTimer);
	}
	
	function actionSlider(ul) {
		var list = jQuery(ul).children('ul');
		list = list.children('li');
		var numbers = list.length;
		
		var temp = 100;
		list.each(function () {
			jQuery(this).css('z-index', temp);
			temp -= 10;
		});
		
		list.first().show();
		
		var count = 0;
		var timer;
		timer = setTimeout(actionChange, 11000);
		
		function actionChange() {
			clearTimeout(timer);
			temp = list.get(count);
			jQuery(temp).fadeOut('slow', function () {
				jQuery(temp).stop();
				count++;
				if(count >= numbers) {
					count = 0;
				}
				temp = list.get(count);
				jQuery(temp).fadeIn('slow', function () {
					jQuery(temp).stop();
					timer = setTimeout(actionChange, 11000);
				});
			});
		}
	}
    
    function startPaper() {
        var colors = ['rgb(230,171,171)', 'rgb(230,171,171)', 'rgb(102,102,102)', 'rgb(153,153,153)', 'rgb(204,204,204)'],
            size = 50, horCount, verCount, countHovered = 0, totalLength = 0, color, triangle,
            canvas = jQuery('<canvas></canvas>').attr({
                id: 'my-canvas'
            }).css({
                position: 'absolute',
                display: 'block'
            });
        jQuery('#center404').prepend(canvas);
            
        canvas = document.getElementById('my-canvas');
        var ctx = canvas.getContext('2d');
        setCanvasSize();     
        paper.setup(canvas);
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);    
            
        function resizeCanvas() {
            clearCanvas();
            setCanvasSize();          
            drawStuff();         
            paper.view.draw();
        }
        
        function drawStuff() {        
            for (var y = 0; y < verCount; y++) {        
                for (var x = 0, tmp = 0, count = 0; tmp < horCount; x++, tmp++, count++) {
                    color = colors[getRandom(0, 4)];
                    if (y % 2 == 0) {
                        switch (count) {
                            case 0:
                                triangle = new paper.Path({ segments: [[x * size, y * size], [(x + 1) * size, y * size], [x * size, (y + 1) * size]] });
                                break;                            
                            case 1:
                                triangle = new paper.Path({ segments: [[x * size, (y + 1) * size], [(x - 1) * size, (y + 1) * size], [x * size, y * size]] });  
                                x-=1;
                                break;                            
                            case 2:
                                triangle = new paper.Path({ segments: [[x * size, (y + 1) * size], [x * size, y * size], [(x + 1) * size, (y + 1) * size]] });
                                break;                        
                            case 3:
                                triangle = new paper.Path({ segments: [[x * size, y * size], [(x - 1) * size, y * size], [x * size, (y + 1) * size]] });
                                count = -1;
                                x-=1;
                                break;                        
                            default:
                                break;
                        }
                    } else {
                        switch (count) {
                            case 0:
                                triangle = new paper.Path({ segments: [[x * size, (y + 1) * size], [x * size, y * size], [(x + 1) * size, (y + 1) * size]] });
                                break;                            
                            case 1:
                                triangle = new paper.Path({ segments: [[x * size, y * size], [(x - 1) * size, y * size], [x * size, (y + 1) * size]] });
                                x-=1;
                                break;                            
                            case 2:
                                triangle = new paper.Path({ segments: [[x * size, y * size], [(x + 1) * size, y * size], [x * size, (y + 1) * size]] });
                                break;                        
                            case 3:
                                triangle = new paper.Path({ segments: [[x * size, (y + 1) * size], [(x - 1) * size, (y + 1) * size], [x * size, y * size]] });  
                                count = -1;
                                x-=1;
                                break;                        
                            default:
                                break;
                        }
                    }
                    triangle.fillColor = color;
                    triangle.closed = true;
                    triangle.selected = false;
                    triangle.onMouseEnter = changeColor;
                    totalLength++;
                }
            }                
        }    
        
        function changeColor() {
            this.remove();
            countHovered++;
            checkColors();
        }                
        
        function checkColors() {
            if (countHovered == totalLength) {
                setTimeout(clearAll, 100);
            }
        }
        
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 90;
            
            horCount = Math.ceil(canvas.width / size * 2);
            if (horCount % 2 != 0) horCount-=1;
            var diff = canvas.width - horCount / 2 * size;
            diff = diff / horCount * 2;
            size += diff;
            
            verCount = Math.ceil(canvas.height / size);
        }
        
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }    
        
        function clearCanvas() {
            var l = paper.project.activeLayer.children.length;
            for (var i = 0; i < l; i++) {
                paper.project.activeLayer.children[0].remove();
            }
            canvas.width = 0;
            canvas.height = 0;
        }
        
        function clearAll() {
            jQuery(canvas).fadeOut(1000);
            var timer = setTimeout(function() {
                clearCanvas();
                jQuery(canvas).remove();
                clearTimeout(timer);
                window.location.href = 'http://' + document.domain;
            }, 1000);
        }
    }
    
    function contactsPage() {
        var map, salon = new google.maps.LatLng(51.5360684, 46.0260847),
        MY_MAPTYPE_ID = 'custom_style';

        function initialize() {           
            var featureOpts = [
                {
                    stylers: [
                        { hue: '#E6ABAB' },
                        { visibility: 'simplified' }
                    ]
                },
                {
                    elementType: 'labels',
                    stylers: [
                        { visibility: 'on' }
                    ]
                },
                {
                    featureType: 'water',
                    stylers: [
                        { color: '#320619' }
                    ]
                }
            ];
        
            var mapOptions = {
                zoom: 16,
                center: salon,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
                },
                mapTypeId: MY_MAPTYPE_ID,
                disableDefaultUI: true
            };
            map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
            var marker = new google.maps.Marker({
                position: salon,
                map: map,
                title: 'Be Happy!'
            }),
                styledMapOptions = { name: 'Custom Style' },
                customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
            map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
        }
        google.maps.event.addDomListener(window, 'load', initialize);
    }
    
    function catalogPage() {
        var mainContainer = jQuery('#main-container'),
            secondary = jQuery('#secondary'),
            toggleMenu = jQuery('#toggle-menu-visibility'),
            toggleMenuIcon = toggleMenu.find('i'),
            menuFilters = jQuery('#menu-filters'),
            secondaryForm = jQuery('#secondary form');
            
        function toggleMenuVisibility() {
            if (mainContainer.hasClass('rolled-out')) {
                mainContainer.removeClass('rolled-out');
                toggleMenuIcon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
                setTimeout(function() { 
                    menuFilters.removeClass('hidden');
                    secondaryForm.removeClass('hidden');
                }, 250);
            } else {      
                menuFilters.addClass('hidden');
                secondaryForm.addClass('hidden');
                mainContainer.addClass('rolled-out');
                toggleMenuIcon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
            }
        }
            
        toggleMenu.on('click', toggleMenuVisibility);
        
        jQuery('body').on('click', '.toggle-slidedown', function() {
            var toggleSlidedowns = jQuery('.toggle-slidedown'),
                index = toggleSlidedowns.index(jQuery(this));               
                
            jQuery('.slidedown').eq(index).toggle('fast');
            var i = toggleSlidedowns.eq(index).find('i');
            if (i.hasClass('fa-chevron-left')) {
                i.removeClass('fa-chevron-left').addClass('fa-chevron-down');
            } else {
                i.removeClass('fa-chevron-down').addClass('fa-chevron-left');
            }
        });    
    }
});