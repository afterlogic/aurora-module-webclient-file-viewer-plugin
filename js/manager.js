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
	
	return {
		/**
		 * Runs before application start. Subscribes to the event before post displaying.
		 * 
		 * @param {Object} ModulesManager
		 */
		start: function (ModulesManager) {
			
			var 
				selector = null,
				filesCollection = ko.observableArray(),
				fillHtmlData = function(item) { 
					var 
						bResult = false,
						sCommonHtmlData = '<div class="title">'+item.fileName()+'</div>';
					;
					if (item.extension().match(/(jpg|jpeg|png|gif)$/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<div class="item-image"><div><img class="owl-lazy" data-src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' /></div></div>');

						bResult = true;
					}
					else if (item.bIsLink && item.sLinkUrl.match(/(youtube.com|youtu.be)/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<div class="item-video"><a class="owl-video" href="' + item.sLinkUrl + '"></a></div>');

						bResult = true;
					}
					else if (item.extension().match(/(doc|docx|xls|xlsx)$/i))
					{
						// item.htmlData = ko.observable(sCommonHtmlData + '<iframe style="width: 100%; height: 100%; border: none;" class="item" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');

						// bResult = true;
					}
					else if (item.extension().match(/(txt)$/i))
					{
						item.htmlData = ko.observable(sCommonHtmlData + '<iframe style="background: #fff; width: 100%; height: 100%; border: none;" src= ' + UrlUtils.getAppPath() + item.getActionUrl('view') + ' />');

						bResult = true;
					}

					return bResult;				
				}
			;
			
			ViewPopup.onClose = function (){
				for (var i=0; i<filesCollection().length; i++) {
					$('.owl-carousel').trigger('remove.owl.carousel', [i]);
				}
				$('.owl-carousel').trigger('refresh.owl.carousel');
				if (selector)
				{
					selector.useKeyboardKeys(true);
				}
			};
			
			App.subscribeEvent('AbstractFileModel::FileView::before', function (oParams) {
				if (_.find(filesCollection(), function(file){ 
					return UrlUtils.getAppPath() + file.getActionUrl('view') === oParams.sUrl; 
				}))
				{
					oParams.bBreakView = true;
					if (selector)
					{
						selector.useKeyboardKeys(false);
					}
					Popups.showPopup(ViewPopup, [filesCollection, oParams.index]);
				}
			});
			
			App.subscribeEvent('FilesWebclient::ConstructView::after', function (oParams) {
				selector = oParams.View.selector;
				oParams.View.filesCollection.subscribe(function(newCollection) {
					var 
						collection = [],
						index = 0
					;
					_.each(newCollection, function(item){ 
						item.index(index);
						if (fillHtmlData(item))
						{
							collection.push(item);
						}
						index++;
					});
					filesCollection(collection);
					App.broadcastEvent('FileViewerWebclientPlugin::FilesCollection::after', {aFilesCollection: filesCollection});
				});
			});
		}
	};
};

