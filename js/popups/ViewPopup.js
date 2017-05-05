'use strict';

require('owl.carousel/dist/assets/owl.carousel.css');
require('owl.carousel/dist/assets/owl.theme.default.css');

var
	$ = require('jquery');
	
	window.jQuery = $;

var 
	_ = require('underscore'),
	ko = require('knockout'),
//	owl_carousel = require('imports?window.jQuery=jquery!owl.carousel'),
	owl_carousel = require('owl.carousel'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
	
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js')
;

/**
 * @constructor
 */
function CViewPopup()
{
	CAbstractPopup.call(this);
	
	this.files = ko.observableArray();
	this.appPath = UrlUtils.getAppPath();
}

_.extendOwn(CViewPopup.prototype, CAbstractPopup.prototype);

CViewPopup.prototype.PopupTemplate = '%ModuleName%_ViewPopup';

CViewPopup.prototype.onShow = function (files, index)
{
	var owl = $('.owl-carousel');
	this.files(files());
	
	owl.owlCarousel({
		items: 1,
		startPosition: index,
		nav: true,
		dotsEach: true,
		lazyLoad:true,
		video: true
	});	
};

CViewPopup.prototype.onClose = function ()
{
	this.files([]);
	this.closePopup();
};

module.exports = new CViewPopup();