'use strict';

require('owl.carousel/dist/assets/owl.carousel.css');
require('owl.carousel/dist/assets/owl.theme.default.css');
require('owl.carousel');

var 
	$ = require('jquery'),
	_ = require('underscore'),
	ko = require('knockout'),
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
	this.files(files());
	
	$('.owl-carousel').owlCarousel({
		items: 1,
		nav: true,
		video: true
	});	
	_.each(this.files(), function (file){
		$('.owl-carousel').trigger('add.owl.carousel', [file.htmlData()]);
	});
	$('.owl-carousel').trigger('to.owl.carousel', [index]);
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
