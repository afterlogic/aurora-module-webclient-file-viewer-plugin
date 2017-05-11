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
					item.htmlData = ko.observable('<img class="item" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');
					
					return true;
				}
				else if (item.bIsLink && item.sLinkUrl.match(/(youtube.com|youtu.be)/i))
				{
					item.htmlData = ko.observable('<a class="owl-video" href="' + item.sLinkUrl + '"></a>');

					return true;
				}
				else if (item.extension().match(/(doc|docx|xls|xlsx)$/i))
				{
					item.htmlData = ko.observable('<iframe style="width: 100%; height: 100%; border: none;" class="item" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');

					return true;
				}
				else if (item.extension().match(/(txt)$/i))
				{
					item.htmlData = ko.observable('<iframe style="width: 100%; height: 100%; border: none;" class="item" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');

					return true;
				}
					
				return false;
			}]);			
			
			App.subscribeEvent('AbstractFileModel::FileView::before', function (oParams) {
				if (_.find(filesCollection(), function(file){ 
					return UrlUtils.getAppPath() + file.getActionUrl('view') === oParams.sUrl; 
				}))
				{
					Popups.showPopup(ViewPopup, [filesCollection, oParams.index]);
				}
			});
			App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
				oParams.View.filesCollection.subscribe(function(newValue) {
					var 
						collection = [],
						added = false,
						index = 0
					;
					_.each(newValue, function(item){ 
						added = false;
						_.each(controllers, function(controller){ 
							if (!added)
							{
								if (controller(item))
								{
									item.index(index);
									collection.push(item);
									added = true;
									index++;
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

