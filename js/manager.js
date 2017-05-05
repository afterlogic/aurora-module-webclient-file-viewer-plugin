'use strict';

var	
	$ = require('jquery'),
	_ = require('underscore'),
	ko = require('knockout'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	ViewPopup = require('modules/%ModuleName%/js/popups/ViewPopup.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js')
;

module.exports = function (oAppData) {
	var controllers = [];
	
	return {
		/**
		 * Runs before application start. Subscribes to the event before post displaying.
		 * 
		 * @param {Object} ModulesManager
		 */
		start: function (ModulesManager) {
			
			var 
				filesCollection = ko.observableArray()
			;
			
			ModulesManager.run('%ModuleName%', 'registerController', [function (item) { 
				if (item.extension().match(/(jpg|jpeg|png|gif)$/i))
				{
					item.htmlData = ko.observable('<img src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');
					
					return true;
				}
				else if (item.bIsLink && item.sLinkUrl.match(/(youtube.com|youtu.be)/i))
				{
					console.log(item.sLinkUrl);
					item.htmlData = ko.observable('<a class="owl-video" href="' + item.sLinkUrl + '"></a>');

					return true;
				}
					
				return false;
			}]);			
			
			App.subscribeEvent('AbstractFileModel::FileView::before', function (oParams) {
				Popups.showPopup(ViewPopup, [filesCollection, oParams.index]);
			});
			App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
					var 
						collection = [],
						added = false
					;
					filesCollection([]);
					oParams.View.filesCollection.subscribe(function(newValue) {
					_.each(newValue, function(item){ 
						added = false;
						_.each(controllers, function(controller){ 
							if (!added)
							{
								if (controller(item))
								{
									collection.push(item);
									added = true;
								}
							}
						});
					});
					filesCollection(collection);
				});
			});
		},
		registerController: function (fCallback)
		{
			controllers.push(fCallback);
		}
	};
};

