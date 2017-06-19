'use strict';

require('modules/%ModuleName%/js/vendors/owl.carousel/assets/owl.carousel.css');
require('modules/%ModuleName%/js/vendors/owl.carousel/assets/owl.theme.default.css');

var
	$ = require('jquery');
	
	window.jQuery = $;

var 
	$ = require('jquery'),
	_ = require('underscore'),
	ko = require('knockout'),
	owl_carousel = require('modules/%ModuleName%/js/vendors/owl.carousel/owl.carousel.js'),

	
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js')
;

/**
 * @constructor
 */
function CViewPopup()
{
	CAbstractPopup.call(this);
	
	this.files = ko.observableArray();
}

_.extendOwn(CViewPopup.prototype, CAbstractPopup.prototype);

CViewPopup.prototype.PopupTemplate = '%ModuleName%_ViewPopup';

CViewPopup.prototype.onShow = function (files, index)
{
	var
		iIndex = 0,
		oRealIndex = {}
	;
	this.files(files());
	
	$('.owl-carousel').owlCarousel({
		items: 1,
		nav: true,
		video: true
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
};

CViewPopup.prototype.onClose = function ()
{
	_.each(this.files(), function (file){
		$('.owl-carousel').trigger('remove.owl.carousel', [file.index()]);
	});
	this.closePopup();
};

module.exports = new CViewPopup();
