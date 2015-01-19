!function(){"use strict";var a={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,COMMAND:91,isControl:function(b){var c=b.which;switch(c){case a.COMMAND:case a.SHIFT:case a.CTRL:case a.ALT:return!0}return b.metaKey?!0:!1},isFunctionKey:function(a){return a=a.which?a.which:a,a>=112&&123>=a},isVerticalMovement:function(b){return~[a.UP,a.DOWN].indexOf(b)},isHorizontalMovement:function(b){return~[a.LEFT,a.RIGHT,a.BACKSPACE,a.DELETE].indexOf(b)}};void 0===angular.element.prototype.querySelectorAll&&(angular.element.prototype.querySelectorAll=function(a){return angular.element(this[0].querySelectorAll(a))}),angular.module("ui.select",[]).constant("uiSelectConfig",{theme:"bootstrap",searchEnabled:!0,placeholder:"",refreshDelay:1e3}).service("uiSelectMinErr",function(){var a=angular.$$minErr("ui.select");return function(){var b=a.apply(this,arguments),c=b.message.replace(new RegExp("\nhttp://errors.angularjs.org/.*"),"");return new Error(c)}}).service("RepeatParser",["uiSelectMinErr","$parse",function(a,b){var c=this;c.parse=function(c){var d=c.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);if(!d)throw a("iexp","Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",c);return{itemName:d[2],source:b(d[3]),trackByExp:d[4],modelMapper:b(d[1]||d[2])}},c.getGroupNgRepeatExpression=function(){return"$group in $select.groups"},c.getNgRepeatExpression=function(a,b,c,d){var e=a+" in "+(d?"$group.items":b);return c&&(e+=" track by "+c),e}}]).controller("uiSelectCtrl",["$scope","$element","$timeout","RepeatParser","uiSelectMinErr",function(b,c,d,e,f){function j(){g.resetSearchInput&&(g.search=h,g.selected&&g.items.length&&!g.multiple&&(g.activeIndex=g.items.indexOf(g.selected)))}function l(b){var c=!0;switch(b){case a.DOWN:!g.open&&g.multiple?g.activate(!1,!0):g.activeIndex<g.items.length-1&&g.activeIndex++;break;case a.UP:!g.open&&g.multiple?g.activate(!1,!0):g.activeIndex>0&&g.activeIndex--;break;case a.TAB:(!g.multiple||g.open)&&g.select(g.items[g.activeIndex],!0);break;case a.ENTER:g.open?g.select(g.items[g.activeIndex]):g.activate(!1,!0);break;case a.ESC:g.close();break;default:c=!1}return c}function m(b){function m(){switch(b){case a.LEFT:return~g.activeMatchIndex?k:f;case a.RIGHT:return~g.activeMatchIndex&&h!==f?j:(g.activate(),!1);case a.BACKSPACE:return~g.activeMatchIndex?(g.removeChoice(h),k):f;case a.DELETE:return~g.activeMatchIndex?(g.removeChoice(g.activeMatchIndex),h):!1}}var c=n(i[0]),d=g.selected.length,e=0,f=d-1,h=g.activeMatchIndex,j=g.activeMatchIndex+1,k=g.activeMatchIndex-1,l=h;return c>0||g.search.length&&b==a.RIGHT?!1:(g.close(),l=m(),g.activeMatchIndex=g.selected.length&&l!==!1?Math.min(f,Math.max(e,l)):-1,!0)}function n(a){return angular.isNumber(a.selectionStart)?a.selectionStart:a.value.length}function o(){var a=c.querySelectorAll(".ui-select-choices-content"),b=a.querySelectorAll(".ui-select-choices-row");if(b.length<1)throw f("choices","Expected multiple .ui-select-choices-row but got '{0}'.",b.length);var d=b[g.activeIndex],e=d.offsetTop+d.clientHeight-a[0].scrollTop,h=a[0].offsetHeight;e>h?a[0].scrollTop+=e-h:e<d.clientHeight&&(g.isGrouped&&0===g.activeIndex?a[0].scrollTop=0:a[0].scrollTop-=d.clientHeight-e)}var g=this,h="";g.placeholder=void 0,g.search=h,g.activeIndex=0,g.activeMatchIndex=-1,g.items=[],g.selected=void 0,g.open=!1,g.focus=!1,g.focusser=void 0,g.disabled=void 0,g.searchEnabled=void 0,g.resetSearchInput=void 0,g.refreshDelay=void 0,g.multiple=!1,g.disableChoiceExpression=void 0,g.isEmpty=function(){return angular.isUndefined(g.selected)||null===g.selected||""===g.selected};var i=c.querySelectorAll("input.ui-select-search");if(1!==i.length)throw f("searchInput","Expected 1 input.ui-select-search but got '{0}'.",i.length);g.activate=function(a,b){g.disabled||g.open||(b||j(),g.focusser.prop("disabled",!0),g.open=!0,g.activeMatchIndex=-1,g.activeIndex=g.activeIndex>=g.items.length?0:g.activeIndex,d(function(){g.search=a||g.search,i[0].focus()}))},g.findGroupByName=function(a){return g.groups&&g.groups.filter(function(b){return b.name===a})[0]},g.parseRepeatAttr=function(a,c){function d(a){g.groups=[],angular.forEach(a,function(a){var d=b.$eval(c),e=angular.isFunction(d)?d(a):a[d],f=g.findGroupByName(e);f?f.items.push(a):g.groups.push({name:e,items:[a]})}),g.items=[],g.groups.forEach(function(a){g.items=g.items.concat(a.items)})}function h(a){g.items=a}var i=c?d:h;g.parserResult=e.parse(a),g.isGrouped=!!c,g.itemProperty=g.parserResult.itemName,b.$watchCollection(g.parserResult.source,function(a){if(void 0===a||null===a)g.items=[];else{if(!angular.isArray(a))throw f("items","Expected an array but got '{0}'.",a);if(g.multiple){var b=a.filter(function(a){return g.selected.indexOf(a)<0});i(b)}else i(a);g.ngModel.$modelValue=null}}),g.multiple&&b.$watchCollection("$select.selected",function(a){var c=g.parserResult.source(b);if(a.length){var d=c.filter(function(b){return a.indexOf(b)<0});i(d)}else i(c);g.sizeSearchInput()})};var k;g.refresh=function(a){void 0!==a&&(k&&d.cancel(k),k=d(function(){b.$eval(a)},g.refreshDelay))},g.setActiveItem=function(a){g.activeIndex=g.items.indexOf(a)},g.isActive=function(a){return g.open&&g.items.indexOf(a[g.itemProperty])===g.activeIndex},g.isDisabled=function(a){if(g.open){var d,b=g.items.indexOf(a[g.itemProperty]),c=!1;return b>=0&&!angular.isUndefined(g.disableChoiceExpression)&&(d=g.items[b],c=!!a.$eval(g.disableChoiceExpression),d._uiSelectChoiceDisabled=c),c}},g.select=function(a,c){if(void 0===a||!a._uiSelectChoiceDisabled){var d={};d[g.parserResult.itemName]=a,g.onSelectCallback(b,{$item:a,$model:g.parserResult.modelMapper(b,d)}),g.multiple?(g.selected.push(a),g.sizeSearchInput()):g.selected=a,g.close(c)}},g.close=function(a){g.open&&(j(),g.open=!1,g.multiple||d(function(){g.focusser.prop("disabled",!1),a||g.focusser[0].focus()},0,!1))},g.toggle=function(a){g.open?g.close():g.activate(),a.preventDefault(),a.stopPropagation()},g.removeChoice=function(a){var c=g.selected[a],d={};d[g.parserResult.itemName]=c,g.selected.splice(a,1),g.activeMatchIndex=-1,g.sizeSearchInput(),g.onRemoveCallback(b,{$item:c,$model:g.parserResult.modelMapper(b,d)})},g.getPlaceholder=function(){return g.multiple&&g.selected.length?void 0:g.placeholder},g.sizeSearchInput=function(){var a=i[0],b=i.parent().parent()[0];i.css("width","10px"),d(function(){var c=b.clientWidth-a.offsetLeft-10;50>c&&(c=b.clientWidth),i.css("width",c+"px")},0,!1)},i.on("keydown",function(c){var d=c.which;b.$apply(function(){var b=!1;g.multiple&&a.isHorizontalMovement(d)&&(b=m(d)),!b&&g.items.length>0&&(b=l(d)),b&&d!=a.TAB&&(c.preventDefault(),c.stopPropagation())}),a.isVerticalMovement(d)&&g.items.length>0&&o()}),i.on("blur",function(){d(function(){g.activeMatchIndex=-1})}),b.$on("$destroy",function(){i.off("keydown blur")})}]).directive("uiSelect",["$document","uiSelectConfig","uiSelectMinErr","$compile","$parse",function(b,c,d,e,f){return{restrict:"EA",templateUrl:function(a,b){var d=b.theme||c.theme;return d+(angular.isDefined(b.multiple)?"/select-multiple.tpl.html":"/select.tpl.html")},replace:!0,transclude:!0,require:["uiSelect","ngModel"],scope:!0,controller:"uiSelectCtrl",controllerAs:"$select",link:function(c,g,h,i,j){function o(a){var b=!1;b=window.jQuery?window.jQuery.contains(g[0],a.target):g[0].contains(a.target),b||(k.close(),c.$digest())}var k=i[0],l=i[1],m=g.querySelectorAll("input.ui-select-search");k.multiple=angular.isDefined(h.multiple)?""===h.multiple?!0:"true"===h.multiple.toLowerCase():!1,k.onSelectCallback=f(h.onSelect),k.onRemoveCallback=f(h.onRemove),l.$parsers.unshift(function(a){var d,b={};if(k.multiple){for(var e=[],f=k.selected.length-1;f>=0;f--)b={},b[k.parserResult.itemName]=k.selected[f],d=k.parserResult.modelMapper(c,b),e.unshift(d);return e}return b={},b[k.parserResult.itemName]=a,d=k.parserResult.modelMapper(c,b)}),l.$formatters.unshift(function(a){var e,b=k.parserResult.source(c,{$select:{search:""}}),d={};if(b){if(k.multiple){var f=[],g=function(a,b){if(a&&a.length){for(var g=a.length-1;g>=0;g--)if(d[k.parserResult.itemName]=a[g],e=k.parserResult.modelMapper(c,d),e==b)return f.unshift(a[g]),!0;return!1}};if(!a)return f;for(var h=a.length-1;h>=0;h--)g(k.selected,a[h])||g(b,a[h]);return f}var i=function(b){return d[k.parserResult.itemName]=b,e=k.parserResult.modelMapper(c,d),e==a};if(k.selected&&i(k.selected))return k.selected;for(var j=b.length-1;j>=0;j--)if(i(b[j]))return b[j]}return a}),k.ngModel=l;var n=angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' aria-haspopup='true' role='button' />");h.tabindex&&h.$observe("tabindex",function(a){k.multiple?m.attr("tabindex",a):n.attr("tabindex",a),g.removeAttr("tabindex")}),e(n)(c),k.focusser=n,k.multiple||(g.append(n),n.bind("focus",function(){c.$evalAsync(function(){k.focus=!0})}),n.bind("blur",function(){c.$evalAsync(function(){k.focus=!1})}),n.bind("keydown",function(b){return b.which===a.BACKSPACE?(b.preventDefault(),b.stopPropagation(),k.select(void 0),c.$apply(),void 0):(b.which===a.TAB||a.isControl(b)||a.isFunctionKey(b)||b.which===a.ESC||((b.which==a.DOWN||b.which==a.UP||b.which==a.ENTER||b.which==a.SPACE)&&(b.preventDefault(),b.stopPropagation(),k.activate()),c.$digest()),void 0)}),n.bind("keyup input",function(b){b.which===a.TAB||a.isControl(b)||a.isFunctionKey(b)||b.which===a.ESC||b.which==a.ENTER||b.which===a.BACKSPACE||(k.activate(n.val()),n.val(""),c.$digest())})),c.$watch("searchEnabled",function(){var a=c.$eval(h.searchEnabled);k.searchEnabled=void 0!==a?a:!0}),h.$observe("disabled",function(){k.disabled=void 0!==h.disabled?h.disabled:!1}),h.$observe("resetSearchInput",function(){var a=c.$eval(h.resetSearchInput);k.resetSearchInput=void 0!==a?a:!0}),k.multiple?(c.$watchCollection("$select.selected",function(){l.$setViewValue(Date.now())}),n.prop("disabled",!0)):c.$watch("$select.selected",function(a){l.$viewValue!==a&&l.$setViewValue(a)}),l.$render=function(){if(k.multiple&&!angular.isArray(l.$viewValue)){if(!angular.isUndefined(l.$viewValue)&&null!==l.$viewValue)throw d("multiarr","Expected model value to be array but got '{0}'",l.$viewValue);k.selected=[]}k.selected=l.$viewValue},b.on("click",o),c.$on("$destroy",function(){b.off("click",o)}),j(c,function(a){var b=angular.element("<div>").append(a),c=b.querySelectorAll(".ui-select-match");if(c.removeAttr("ui-select-match"),1!==c.length)throw d("transcluded","Expected 1 .ui-select-match but got '{0}'.",c.length);g.querySelectorAll(".ui-select-match").replaceWith(c);var e=b.querySelectorAll(".ui-select-choices");if(e.removeAttr("ui-select-choices"),1!==e.length)throw d("transcluded","Expected 1 .ui-select-choices but got '{0}'.",e.length);g.querySelectorAll(".ui-select-choices").replaceWith(e)})}}}]).directive("uiSelectChoices",["uiSelectConfig","RepeatParser","uiSelectMinErr","$compile",function(a,b,c,d){return{restrict:"EA",require:"^uiSelect",replace:!0,transclude:!0,templateUrl:function(b){var c=b.parent().attr("theme")||a.theme;return c+"/choices.tpl.html"},compile:function(e,f){if(!f.repeat)throw c("repeat","Expected 'repeat' expression.");return function(e,f,g,h,i){var j=g.groupBy;if(h.parseRepeatAttr(g.repeat,j),h.disableChoiceExpression=g.uiDisableChoice,j){var k=f.querySelectorAll(".ui-select-choices-group");if(1!==k.length)throw c("rows","Expected 1 .ui-select-choices-group but got '{0}'.",k.length);k.attr("ng-repeat",b.getGroupNgRepeatExpression())}var l=f.querySelectorAll(".ui-select-choices-row");if(1!==l.length)throw c("rows","Expected 1 .ui-select-choices-row but got '{0}'.",l.length);l.attr("ng-repeat",b.getNgRepeatExpression(h.parserResult.itemName,"$select.items",h.parserResult.trackByExp,j)).attr("ng-mouseenter","$select.setActiveItem("+h.parserResult.itemName+")").attr("ng-click","$select.select("+h.parserResult.itemName+")");var m=f.querySelectorAll(".ui-select-choices-row-inner");if(1!==m.length)throw c("rows","Expected 1 .ui-select-choices-row-inner but got '{0}'.",m.length);m.attr("uis-transclude-append",""),d(f,i)(e),e.$watch("$select.search",function(a){a&&!h.open&&h.multiple&&h.activate(!1,!0),h.activeIndex=0,h.refresh(g.refresh)}),g.$observe("refreshDelay",function(){var b=e.$eval(g.refreshDelay);h.refreshDelay=void 0!==b?b:a.refreshDelay})}}}}]).directive("uisTranscludeAppend",function(){return{link:function(a,b,c,d,e){e(a,function(a){b.append(a)})}}}).directive("uiSelectMatch",["uiSelectConfig",function(a){return{restrict:"EA",require:"^uiSelect",replace:!0,transclude:!0,templateUrl:function(b){var c=b.parent().attr("theme")||a.theme,d=b.parent().attr("multiple");return c+(d?"/match-multiple.tpl.html":"/match.tpl.html")},link:function(b,c,d,e){d.$observe("placeholder",function(b){e.placeholder=void 0!==b?b:a.placeholder}),e.multiple&&e.sizeSearchInput()}}}]).filter("highlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c&&b?b.replace(new RegExp(a(c),"gi"),'<span class="ui-select-highlight">$&</span>'):b}})}(),angular.module("ui.select").run(["$templateCache",function(a){a.put("bootstrap/choices.tpl.html",'<ul class="ui-select-choices ui-select-choices-content dropdown-menu" role="menu" aria-labelledby="dLabel" ng-show="$select.items.length > 0"><li class="ui-select-choices-group"><div class="divider" ng-show="$select.isGrouped && $index > 0"></div><div ng-show="$select.isGrouped" class="ui-select-choices-group-label dropdown-header">{{$group.name}}</div><div class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}"><a href="javascript:void(0)" class="ui-select-choices-row-inner"></a></div></li></ul>'),a.put("bootstrap/match-multiple.tpl.html",'<span class="ui-select-match"><span ng-repeat="$item in $select.selected"><span style="margin-right: 3px;" class="ui-select-match-item btn btn-default btn-xs" tabindex="-1" type="button" ng-disabled="$select.disabled" ng-click="$select.activeMatchIndex = $index;" ng-class="{\'btn-primary\':$select.activeMatchIndex === $index}"><span class="close ui-select-match-close" ng-hide="$select.disabled" ng-click="$select.removeChoice($index)">&nbsp;&times;</span> <span uis-transclude-append=""></span></span></span></span>'),a.put("bootstrap/match.tpl.html",'<button type="button" class="btn btn-default form-control ui-select-match" tabindex="-1" ng-hide="$select.open" ng-disabled="$select.disabled" ng-class="{\'btn-default-focus\':$select.focus}" ;="" ng-click="$select.activate()"><span ng-show="$select.searchEnabled && $select.isEmpty()" class="text-muted">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" ng-transclude=""></span> <span class="caret ui-select-toggle" ng-click="$select.toggle($event)"></span></button>'),a.put("bootstrap/select-multiple.tpl.html",'<div class="ui-select-multiple ui-select-bootstrap dropdown form-control" ng-class="{open: $select.open}"><div><div class="ui-select-match"></div><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="ui-select-search input-xs" placeholder="{{$select.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-click="$select.activate()" ng-model="$select.search"></div><div class="ui-select-choices"></div></div>'),a.put("bootstrap/select.tpl.html",'<div class="ui-select-bootstrap dropdown" ng-class="{open: $select.open}"><div class="ui-select-match"></div><input type="text" autocomplete="off" tabindex="-1" class="form-control ui-select-search" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-show="$select.searchEnabled && $select.open"><div class="ui-select-choices"></div></div>'),a.put("select2/choices.tpl.html",'<ul class="ui-select-choices ui-select-choices-content select2-results"><li class="ui-select-choices-group" ng-class="{\'select2-result-with-children\': $select.isGrouped}"><div ng-show="$select.isGrouped" class="ui-select-choices-group-label select2-result-label">{{$group.name}}</div><ul ng-class="{\'select2-result-sub\': $select.isGrouped, \'select2-result-single\': !$select.isGrouped}"><li class="ui-select-choices-row" ng-class="{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}"><div class="select2-result-label ui-select-choices-row-inner"></div></li></ul></li></ul>'),a.put("select2/match-multiple.tpl.html",'<span class="ui-select-match"><li class="ui-select-match-item select2-search-choice" ng-repeat="$item in $select.selected" ng-class="{\'select2-search-choice-focus\':$select.activeMatchIndex === $index}"><span uis-transclude-append=""></span> <a href="javascript:;" class="ui-select-match-close select2-search-choice-close" ng-click="$select.removeChoice($index)" tabindex="-1"></a></li></span>'),a.put("select2/match.tpl.html",'<a class="select2-choice ui-select-match" ng-class="{\'select2-default\': $select.isEmpty()}" ng-click="$select.activate()"><span ng-show="$select.searchEnabled && $select.isEmpty()" class="select2-chosen">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" class="select2-chosen" ng-transclude=""></span> <span class="select2-arrow ui-select-toggle" ng-click="$select.toggle($event)"><b></b></span></a>'),a.put("select2/select-multiple.tpl.html",'<div class="ui-select-multiple select2 select2-container select2-container-multi" ng-class="{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled}"><ul class="select2-choices"><span class="ui-select-match"></span><li class="select2-search-field"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input ui-select-search" placeholder="{{$select.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-model="$select.search" ng-click="$select.activate()" style="width: 34px;"></li></ul><div class="select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="ui-select-choices"></div></div></div>'),a.put("select2/select.tpl.html",'<div class="select2 select2-container" ng-class="{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled,\n                \'select2-container-active\': $select.focus }"><div class="ui-select-match"></div><div class="select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="select2-search" ng-show="$select.searchEnabled"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="ui-select-search select2-input" ng-model="$select.search"></div><div class="ui-select-choices"></div></div></div>'),a.put("selectize/choices.tpl.html",'<div ng-show="$select.open" class="ui-select-choices selectize-dropdown single"><div class="ui-select-choices-content selectize-dropdown-content"><div class="ui-select-choices-group optgroup"><div ng-show="$select.isGrouped" class="ui-select-choices-group-label optgroup-header">{{$group.name}}</div><div class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}"><div class="option ui-select-choices-row-inner" data-selectable=""></div></div></div></div></div>'),a.put("selectize/match.tpl.html",'<div ng-hide="$select.searchEnabled && ($select.open || $select.isEmpty())" class="ui-select-match" ng-transclude=""></div>'),a.put("selectize/select.tpl.html",'<div class="selectize-control single"><div class="selectize-input" ng-class="{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}" ng-click="$select.activate()"><div class="ui-select-match"></div><input type="text" autocomplete="off" tabindex="-1" class="ui-select-search ui-select-toggle" ng-click="$select.toggle($event)" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-hide="!$select.searchEnabled || ($select.selected && !$select.open)" ng-disabled="$select.disabled"></div><div class="ui-select-choices"></div></div>')}]);