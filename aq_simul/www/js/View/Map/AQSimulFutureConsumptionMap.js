'use strict';

App.View.Panels.Aq_simul.FutureConsumptionMap = App.View.Map.MapboxView.extend({

  initialize: function (options) {
		
		this.constructionTypesModel = new App.Model.Aq_simul.ConstructionTypesModel({scope: options.scope});

    options = _.defaults(options, {
      defaultBasemap: 'positron',
      sprites: '/verticals/aquasig-theme/mapstyle/sprite',      
      center: [-6.058731999113434, 37.34176929299322],
      type: 'now',
    });

    var prevWeek = App.Utils.getPrevWeek();   

    this._payload = {
      agg: 'SUM',
      var: 'aq_simul.sector.rates',
      time: {
          start: prevWeek[0],
          finish: prevWeek[1]
      },
      filters: {
        condition: {}
      }
    },

    App.View.Map.MapboxView.prototype.initialize.call(this, options);
  },

  _onMapLoaded: function(bbox) {
    this.layers = new App.View.Map.Layer.Aq_simul.FutureConsumptionLayer(this._options, this._payload, this);
    if (this.getBbbox(bbox)) this.getConstructionTypesModel(bbox);
  },

  _onBBoxChange: function(bbox) {
    if (this.getBbbox(bbox)) this.getConstructionTypesModel(bbox);
  },

  onClose: function() {
    if(this.layers !== undefined)
      this.layers.close();
  },

  toggle3d: function(e) {
    App.View.Map.MapboxView.prototype.toggle3d.call(this,e);
    let zoom = this._map.getZoom();
    if(zoom < 16 && this._is3dActive) {
      this._map.easeTo({zoom: 16});
    }
    this._map.setLayoutProperty('plot_buildings', 'visibility', this._is3dActive ? 'visible' : 'none');
	},
  
  getBbbox: function(bbox) {
    if (App.ctx.get('bbox_status')) {
      let __bbox = [bbox.getNorthEast().lng,bbox.getNorthEast().lat,bbox.getSouthWest().lng,bbox.getSouthWest().lat]
      // Recover when backend accepts bbox: App.ctx.set('bbox', __bbox);
      return __bbox;
    }
  },

	getConstructionTypesModel: function(bboxCoords) {
		this.constructionTypesModel.fetch({data: {filters: {}}});
		this.clearLegend();
		this.constructionTypesModel.parse = (e) => {
      _.each(e, (f,i) => {
				this.updateLegend(f)
      });
      this.drawLegend();
    }
	},
	
	updateLegend: function(item) {
    let sectionIconurl = this.normalizeText(item.type_name);
		this.addToLegend({
			name: item.type_name,
			sectionIcon: '/verticals/aquasig-theme/img/icons/map/' + sectionIconurl + '.svg',
      sectionName: item.type_name,
      sectionCount: item.count
		})
  },

  normalizeText: function(text) {
    text = text.toLowerCase();
    text = text.replace(" ","-");
    text = text.replace(/á/gi,"a");
    text = text.replace(/é/gi,"e");
    text = text.replace(/í/gi,"i");
    text = text.replace(/ó/gi,"o");
    text = text.replace(/ú/gi,"u");
    text = text.replace(/ñ/gi,"n");
    return text;
  }
  

});
