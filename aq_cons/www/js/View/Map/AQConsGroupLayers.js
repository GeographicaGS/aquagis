
App.View.Map.Layer.Aq_cons.GroupLayer = Backbone.View.extend({
  iconsFolder: '/verticals/aquagis-theme/img/icons/map',

  initialize: function(options, payload, map) {
    this._payload = payload;

    // Modelos
    let sensor = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.sensor'});
    let sector = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cons.sector'});
    let tank = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.tank'});
    let connection = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.connections_point'});
    let connectionLine = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.connections_line'});
    let supply = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.supply_point'});
    let supplyLine = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.supply_line'});
    let hydrant = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.hydrant_point'});
    let hydrantLine = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.hydrant_line'});
    let valve = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.valve_point'});
    let valveLine = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.valve_line'});
    let well = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.well_point'});
    let wellLine = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cata.well_line'});
    let plot = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cons.plot'});
    let plotStructure = new App.Model.Aq_cons.Model({scope: options.scope, type: options.type, entity: 'aq_cons.const'});


    // Layers
    // SECTOR
    this._sectorLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'aqua_sectors',
        model: sector,
        payload: this._payload
      },
      legend: {
        sectionId: 'sector',
        sectionIcon: this.iconsFolder + '/sectores.svg',
        sectionName: __('Sectores'),
        name: __('Sectores')
      },
      layers:[{
        'id': 'sector',
        'type': 'fill',
        'source': 'aqua_sectors',
        'layout': {},
        'maxzoom': 16,
        'paint': {
          'fill-color': {
            'property': 'aq_cons.sector.forecast',
            'type': 'exponential',
            'default': 'red',
            'stops': [
              [0, '#64B6D9'],
              [1, '#4CA7D7'],
              [2, '#3397D5'],
              [3, '#1A88D3'],
              [4, '#0278D1']
            ]
          },
          'fill-opacity': 0.7
        }
      },
      {
        'id': 'sector_line',
        'type': 'line',
        'source': 'aqua_sectors',
        'layout': {},
        'paint': {
          'line-color': '#165288',
          'line-width': 2,
          'line-dasharray': [2,2]
        }
      }
    ],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Sector'),[{
      feature: 'id_entity',
      label: 'Identificador',
      units: ''
    }, {
      feature: 'name',
      label: 'Nombre',
      units: ''
    }, {
      feature: 'aq_cons.sector.forecast?',
      label: 'Previsión',
      units: 'm³',
      nbf: App.nbf
    }, {
      feature: 'aq_cons.sector.consumption?',
      label: 'Consumo',
      units: 'm³',
      nbf: App.nbf
    }]);

    let plotPayload = JSON.parse(JSON.stringify(this._payload));
    plotPayload.var = 'aq_cons.plot.consumption';

    this._plotLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'aqua_plots',
        model: plot,
        payload: plotPayload
      },
      legend: {
        sectionId: 'plot',
        sectionIcon: this.iconsFolder + '/edificio.svg',
        sectionName: __('Edificios'),
        name: __('Edificios')
      },
      layers:[{
        'id': 'plot',
        'type': 'fill',
        'source': 'aqua_plots',
        'layout': {},
        'minzoom': 16,
        'paint': {
            'fill-color': '#165288',
            'fill-opacity': 0.4
        }
      },
      {
        'id': 'plot_line',
        'type': 'line',
        'source': 'aqua_plots',
        'layout': {},
        'minzoom': 16,
        'paint': {
          'line-color': '#165288',
          'line-width': 1
        }
      }
    ],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Parcela'),[{
      feature: 'id_entity',
      label: 'Identificador',
      units: ''
    }, {
      feature: 'area',
      label: 'Área',
      units: 'm2'
    }, {
      feature: 'floors',
      label: 'Plantas',
      units: ''
    },{
      feature: 'description#RegistryRef',
      label: 'Identificador catastral',
      units: ''
    },{
      feature: 'description#Block',
      label: 'Identificador de manzana',
      units: ''
    },{
      feature: 'aq_cons.const.forecast?',
      label: 'Previsión',
      units: 'm³',
      nbf: App.nbf
    }, {
      feature: 'aq_cons.const.consumption?',
      label: 'Consumo',
      units: 'm³',
      nbf: App.nbf
    }]);

    this._supplyLineLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'supply_line_datasource',
        model: supplyLine,
        payload: this._payload
      },
      legend: {
        sectionId: 'supply',
        sectionIcon: this.iconsFolder + '/red.svg',
        sectionName: __('Red de abastecimiento'),
        name: __('Red de abastecimiento')
      },
      layers:[{
        'id': 'supply_line',
        'type': 'line',
        'source': 'supply_line_datasource',
        'paint': {
          'line-color': '#86E9A7',
        }
      }],
      map: map
    });

    this._wellLineLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'well_line_datasource',
        model: wellLine,
        payload: this._payload
      },
      legend: {
        sectionId: 'wells',
        sectionIcon: this.iconsFolder + '/pozo.svg',
        sectionName: __('Pozos'),
        name: __('Red')
      },
      layers:[{
        'id': 'well_line',
        'type': 'line',
        'source': 'well_line_datasource',
        'paint': {
          'line-color': '#0F82E0',
        }
      }],
      map: map
    });

    this._hydrantLineLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'hydrant_line_datasource',
        model: hydrantLine,
        payload: this._payload
      },
      legend: {
        sectionId: 'hydrants',
        sectionIcon: this.iconsFolder + '/hidrante.svg',
        sectionName: __('Hidrantes'),
        name: __('Red')
      },
      layers:[{
        'id': 'hydrant_line',
        'type': 'line',
        'source': 'hydrant_line_datasource',
        'paint': {
          'line-color': '#6D83E9',
        }
      }],
      map: map
    });

    this._valveLineLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'valve_line_datasource',
        model: valveLine,
        payload: this._payload
      },
      legend: {
        sectionId: 'valves',
        sectionIcon: this.iconsFolder + '/valvula.svg',
        sectionName: __('Válvulas'),
        name: __('Red')
      },
      layers:[{
        'id': 'valve_line',
        'type': 'line',
        'source': 'valve_line_datasource',
        'paint': {
          'line-color': '#68BC84',
        }
      }],
      map: map
    });

    this._connectionLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'connections_datasource',
        model: connection,
        payload: this._payload
      },
      legend: {
        sectionId: 'connections',
        sectionIcon: this.iconsFolder + '/acometida.svg',
        sectionName: __('Acometidas'),
        name: __('Acometidas')
      },
      layers:[{
        'id': 'connections_circle',
        'type': 'circle',
        'source': 'connections_datasource',
        'minzoom': 14,
        'maxzoom': 16,
        'paint': {
          'circle-radius': 2,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#3561BA',
        }
      },
      {
        'id': 'connections_circle_2',
        'type': 'circle',
        'source': 'connections_datasource',
        'minzoom': 16,
        'maxzoom': 17,
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#3561BA',
        }
      },
       {
        'id': 'connections_symbol',
        'type': 'symbol',
        'source': 'connections_datasource',
        'minzoom': 17,
        'layout': {

          'icon-image': 'acometida',
          'icon-allow-overlap': true
        }
      }],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Acometida'),[{
      feature:'id_acome_p',
      label: 'Identificador',
      units: ''
    }]);

    this._hydrantLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'hydrants_datasource',
        model: hydrant,
        payload: this._payload
      },
      legend: {
        sectionId: 'hydrants',
        sectionIcon: this.iconsFolder + '/hidrante.svg',
        sectionName: __('Hidrantes'),
        name: __('Hidrantes')
      },
      layers:[{
        'id': 'hydrants_circle',
        'type': 'circle',
        'source': 'hydrants_datasource',
        'minzoom': 14,
        'maxzoom': 16,
        'paint': {
          'circle-radius': 2,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#E87668',
        }
      },
      {
        'id': 'hydrants_circle_2',
        'type': 'circle',
        'source': 'hydrants_datasource',
        'minzoom': 16,
        'maxzoom': 17,
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#E87668',
        }
      },
      {
        'id': 'hydrants_symbol',
        'type': 'symbol',
        'source': 'hydrants_datasource',
        'minzoom': 17,
        'layout': {

          'icon-image': 'hidrante',
          'icon-allow-overlap': true
        }
      }],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Hidrante'),[{
      feature:'id_hydra_p',
      label: 'Identificador',
      units: ''
    }]);

    this._valveLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'valves_datasource',
        model: valve,
        payload: this._payload
      },
      legend: {
        sectionId: 'valves',
        sectionIcon: this.iconsFolder + '/valvula.svg',
        sectionName: __('Válvulas'),
        name: __('Válvulas')
      },
      layers:[{
        'id': 'valves_circle',
        'type': 'circle',
        'source': 'valves_datasource',
        'minzoom': 14,
        'maxzoom': 16,
        'paint': {
          'circle-radius': 2,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#68BC84',
        }
      },
      {
        'id': 'valves_circle_2',
        'type': 'circle',
        'source': 'valves_datasource',
        'minzoom': 16,
        'maxzoom': 17,
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#68BC84',
        }
      },
       {
        'id': 'valves_symbol',
        'type': 'symbol',
        'source': 'valves_datasource',
        'minzoom': 17,
        'layout': {

          'icon-image': 'valvula',
          'icon-allow-overlap': true
        }
      }],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Válvula'),[{
      feature:'id_valve_p',
      label: 'Identificador',
      units: ''
    }]);

    this._wellLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'wells_datasource',
        model: well,
        payload: this._payload
      },
      legend: {
        sectionId: 'wells',
        sectionIcon: this.iconsFolder + '/pozo.svg',
        sectionName: __('Pozos'),
        name: __('Pozos')
      },
      layers:[{
        'id': 'wells_circle',
        'type': 'circle',
        'source': 'wells_datasource',
        'minzoom': 14,
        'maxzoom': 16,
        'paint': {
          'circle-radius': 2,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#0F82E0',
        }
      },
      {
        'id': 'wells_circle_2',
        'type': 'circle',
        'source': 'wells_datasource',
        'minzoom': 16,
        'maxzoom': 17,
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFF',
          'circle-color': '#0F82E0',
        }
      },
      {
        'id': 'wells_symbol',
        'type': 'symbol',
        'source': 'wells_datasource',
        'minzoom': 17,
        'layout': {

          'icon-image': 'pozo',
          'icon-allow-overlap': true
        }
      }],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Pozo'),[{
      feature:'id_well_p',
      label: 'Identificador',
      units: ''
    }]);

    this._sensorLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'sensors_datasource',
        model: sensor,
        payload: this._payload
      },
      legend: {
        sectionId: 'sensor',
        sectionIcon: this.iconsFolder + '/sensor-agua.svg',
        sectionName: __('Sensores'),
        name: __('Sensores')
      },
      layers:[{
        'id': 'sensors_circle',
        'type': 'circle',
        'source': 'sensors_datasource',
        'maxzoom': 16,
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#DDDDDF',
          'circle-color': '#8672D2',
        }
      }, {
        'id': 'sensors_symbol',
        'type': 'symbol',
        'source': 'sensors_datasource',
        'minzoom': 16,
        'layout': {

          'icon-image': 'sensor-agua',
          'icon-allow-overlap': true
        }
      }],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Sensor'),[{
      feature: 'id_sensor',
      label: 'Identificador',
      units: ''
    },{
      feature: 'id_sector',
      label: 'Identificador de sector',
      units: ''
    }]);

    this._tankLayer = new App.View.Map.Layer.Aq_cons.GeoJSONLayer({
      source: {
        id: 'tanks_datasource',
        model: tank,
        payload: this._payload
      },
      legend: {
        sectionId: 'tanks',
        sectionIcon: this.iconsFolder + '/deposito.svg',
        sectionName: __('Depósitos'),
        name: __('Depósitos')
      },
      layers:[{
        'id': 'tanks_circle',
        'type': 'circle',
        'source': 'tanks_datasource',
        'maxzoom': 16,
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#DDDDDF',
          'circle-color': '#68BEE2',
        }
      }, {
        'id': 'tanks_symbol',
        'type': 'symbol',
        'source': 'tanks_datasource',
        'minzoom': 16,
        'layout': {

          'icon-image': 'deposito',
          'icon-allow-overlap': true
        }
      }],
      map: map
    })
    .setHoverable(true)
    .setInteractivity(__('Depósito'),[{
      feature:'id_tank',
      label: 'Identificador',
      units: ''
    },{
      feature:'capacity',
      label: 'Capacidad',
      units: 'l'
    },{
      feature:'status',
      label: 'Estado',
      units: ''
    },{
      feature:'location',
      label: 'Ubicación',
      units: ''
    }]);
  },

  onClose: function() {
    this._sectorLayer.close();
    this._plotLayer.close();
    this._supplyLineLayer.close();
    this._wellLineLayer.close();
    this._hydrantLineLayer.close();
    this._valveLineLayer.close();
    this._connectionLayer.close();
    this._hydrantLayer.close();
    this._valveLayer.close();
    this._wellLayer.close();
    this._sensorLayer.close();
    this._tankLayer.close();
  },

  updatePayload: function(payload) {

    this._sectorLayer.updateData(payload);
    this._sectorLayer.updatePaintOptions(payload.var);
    this._plotLayer.updateData(payload);
    this._supplyLineLayer.updateData(payload);
    this._wellLineLayer.updateData(payload);
    this._hydrantLineLayer.updateData(payload);
    this._valveLineLayer.updateData(payload);
    this._connectionLayer.updateData(payload);
    this._hydrantLayer.updateData(payload);
    this._valveLayer.updateData(payload);
    this._wellLayer.updateData(payload);
    this._sensorLayer.updateData(payload);
    this._tankLayer.updateData(payload);


  }
});