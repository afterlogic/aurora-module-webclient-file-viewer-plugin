'use strict';

var 
	$ = require('jquery'),
	_ = require('underscore'),
	ko = require('knockout'),
	
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js')
;

require('modules/%ModuleName%/js/vendors/owl.carousel/owl.carousel.js'),
require('modules/%ModuleName%/js/vendors/owl.carousel/assets/owl.carousel.css');
require('modules/%ModuleName%/js/vendors/owl.carousel/assets/owl.theme.default.css');

/**
 * @constructor
 */
function CViewPopup()
{
	CAbstractPopup.call(this);
	
	this.files = ko.observableArray();
	
	$(document.documentElement).keyup(function (event) {    

		var owl = jQuery(".owl-carousel");

		if (event.keyCode === 37) 
		{
		   owl.trigger('prev.owl.carousel');
		} 
		else if (event.keyCode === 39) 
		{
		   owl.trigger('next.owl.carousel');
		}
	});	
}

_.extendOwn(CViewPopup.prototype, CAbstractPopup.prototype);

CViewPopup.prototype.PopupTemplate = '%ModuleName%_ViewPopup';

CViewPopup.prototype.onOpen = function (files, index)
{
	var
		iIndex = 0,
		oRealIndex = {},
		self = this
	;
	this.files(files());
	
	$('.owl-carousel').owlCarousel({
		items: 1,
		nav: true,
		dots: false,
		video: true,
		navText: ['', ''],
		lazyLoad: true
	});	
	_.each(this.files(), function (file){
		$('.owl-carousel').trigger('add.owl.carousel', [file.htmlData()]);
		oRealIndex[file.index()] = iIndex++;
	});
	$('.owl-carousel').trigger('to.owl.carousel', [oRealIndex[index]]);
	$('.owl-carousel').trigger('refresh.owl.carousel');
	
	_.defer(function () {
		$('.owl-carousel').trigger('refresh.owl.carousel');
	});
	
	$('.popup_panel').click(function (event) {    
		if (event.target.nodeName !== 'IMG' && event.target.nodeName !== 'IFRAME' && !event.target.classList.contains('owl-next') && !event.target.classList.contains('owl-prev'))
		{
			self.close();
		}
	});
};

CViewPopup.prototype.close = function ()
{
	_.each(this.files(), function (file){
		$('.owl-carousel').trigger('remove.owl.carousel', [file.index()]);
	});
	this.closePopup();
};

module.exports = new CViewPopup();
