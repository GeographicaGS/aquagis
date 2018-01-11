'use strict';

App.View.Map.Layer.ValveLineLayer = App.View.Map.Layer.MapboxGLLayer.extend({


  initialize: function(model, body, map) {
    this._idSource = 'valve_line_datasource';
    this._ids = ['valve_lines_point'];
    
    App.View.Map.Layer.MapboxGLLayer.prototype.initialize.call(this, model, body, map);
  },

  _success: function(change) {
    App.View.Map.Layer.MapboxGLLayer.prototype._success.call(this, change);    
  },

  _layersConfig: function() {
    return this.layers = [{
      'id': this._ids[0],
      'type': 'line',
      'source': this._idSource,
      'paint': {
        'line-color': 'red',
      }
    }];
  }
});