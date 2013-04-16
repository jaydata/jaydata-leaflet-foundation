﻿$data.LeafletOptions = L.Control.extend({
    options: {
        position: 'topright',
        autoZIndex: true
    },

    initialize: function (options) {
        L.setOptions(this, options);

    },

    onAdd: function (map) {
        //this._initLayout();
        //this._update();

        //map
		//    .on('layeradd', this._onLayerChange, this)
		//    .on('layerremove', this._onLayerChange, this);
        var container = this._container = L.DomUtil.create('div', 'leaflet-control-options');
        //$(container).html('<b>!</b>');
        console.log(container);
        return container;
    },

    beginProcess: function (process) {
        var indicator = $("<div style='font-size: 8pt'><img src='ajax-loader.gif' /></div>");
        $(this._container).append(indicator);

        indicator.complete = function (message) {
            if (message) {
                $(indicator).html(message);
                window.setTimeout(function () {
                    $(indicator).remove();
                }, 2000);
            } else {
                $(indicator).remove();
            }
            
        }

        return indicator;
    },

    _initLayout: function () {


        //var className = 'leaflet-control-layers',
		//    container = this._container = L.DomUtil.create('div', className);

        //if (!L.Browser.touch) {
        //    L.DomEvent.disableClickPropagation(container);
        //    L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
        //} else {
        //    L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
        //}

        //var form = this._form = L.DomUtil.create('form', className + '-list');

        //if (this.options.collapsed) {
        //    L.DomEvent
		//	    .on(container, 'mouseover', this._expand, this)
		//	    .on(container, 'mouseout', this._collapse, this);

        //    var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
        //    link.href = '#';
        //    link.title = 'Layers';

        //    if (L.Browser.touch) {
        //        L.DomEvent
		//		    .on(link, 'click', L.DomEvent.stopPropagation)
		//		    .on(link, 'click', L.DomEvent.preventDefault)
		//		    .on(link, 'click', this._expand, this);
        //    }
        //    else {
        //        L.DomEvent.on(link, 'focus', this._expand, this);
        //    }

        //    this._map.on('movestart', this._collapse, this);
        //    // TODO keyboard accessibility
        //} else {
        //    this._expand();
        //}

        //this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        //this._separator = L.DomUtil.create('div', className + '-separator', form);
        //this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        //container.appendChild(form);
    }
});