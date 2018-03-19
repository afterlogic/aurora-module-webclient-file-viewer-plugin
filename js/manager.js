'use strict';

var	
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
				filesCollection = ko.observableArray(),
				fillHtmlData = function(item) { 
					var 
						bResult = false,
						sCommonHtmlData = '<div class="title">'+item.fileName()+'</div>';
					;
					if (item.extension().match(/(jpg|jpeg|png|gif)$/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<div class="item-image"><div><img src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' /></div></div>');

						bResult = true;
					}
					else if (item.bIsLink && item.sLinkUrl.match(/(youtube.com|youtu.be)/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<div class="item-video"><a class="owl-video" href="' + item.sLinkUrl + '"></a></div>');

						bResult = true;
					}
					else if (item.extension().match(/(doc|docx|xls|xlsx)$/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<iframe style="width: 100%; height: 100%; border: none;" class="item" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');

						bResult = true;
					}
					else if (item.extension().match(/(txt)$/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<iframe style="width: 100%; height: 100%; border: none;" class="item" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');

						bResult = true;
					}

					return bResult;				
				}
			;
			
			App.subscribeEvent('AbstractFileModel::FileView::before', function (oParams) {
				if (_.find(filesCollection(), function(file){ 
					return UrlUtils.getAppPath() + file.getActionUrl('view') === oParams.sUrl; 
				}))
				{
					oParams.bBreakView = true;
					Popups.showPopup(ViewPopup, [filesCollection, oParams.index]);
				}
			});
			
			App.subscribeEvent('FilesWebclient::ConstructView::after', function (oParams) {
				oParams.View.filesCollection.subscribe(function(newValue) {
					var 
						collection = [],
						index = 0
					;
					_.each(newValue, function(item){ 
						if (fillHtmlData(item))
						{
							item.index(index);
							collection.push(item);
							index++;
						}
					});
					filesCollection(collection);
					App.broadcastEvent('FileViewerWebclientPlugin::FilesCollection::after', {aFilesCollection: filesCollection});
				});
			});
		}
	};
};

