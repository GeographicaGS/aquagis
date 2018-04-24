'use strict';

App.View.Panels.Aq_cons.Saving = App.View.Panels.Splitted.extend({
  _mapInstance: null,

  initialize: function (options) {
    options = _.defaults(options, {
      dateView: true,
      id_category: 'aq_cons',
      spatialFilter: true,
      master: false,
      title: __('Previsión de ahorro'),
      id_panel: 'saving',
      filteView: false,
    });
    
    App.View.Panels.Splitted.prototype.initialize.call(this, options);
    this.render();
  },

  customRender: function() {
    this._widgets = [];

    this.subviews.push(new App.View.Widgets.Container({
      widgets: this._widgets,
      el: this.$('.bottom .widgetContainer')
    }));

  },

  onAttachToDOM: function() {
    this._mapView = new App.View.Panels.Aq_cons.SavingMap({
      el: this.$('.top'),
      scope: this.scopeModel.get('id'),
      type: 'now'
    }).render();
    
    this.listenTo(this._mapView.mapChanges,'change:clickedSector', this._openDetails);
    
    this.subviews.push(this._mapView);
  },

  _openDetails: function(e) {
    if(e.get('clickedSector') === undefined) {
      this._closeDetails();
    } else {
      // 1.- Cleaning widget container
      let clicked = e.toJSON().clickedSector;
      this.$('.bottom .widgetContainer').html('');
  
      // 2.- Calling to renderer for detail's widget
      this._customRenderDetails(clicked);      
      
      // 3.- Reloading Masonry
      this.$('.bottom .widgetContainer').masonry('reloadItems',{
        gutter: 20,
        columnWidth: 360
      });
    }
  },

  _onTopHidingToggled: function(e){
    if(this._mapView){
      this._mapView.$el.toggleClass('collapsed');
      setTimeout(function(){
        this._mapView.resetSize();
      }.bind(this), 300);
    }
  },

  _customRenderDetails: function(tank) {
    this._widgets = [];
    this._widgets.push(new App.View.Widgets.Aq_cons.TankSize({
      id_scope: this.scopeModel.get('id'),
      timeMode:'now',
    }));

    this._widgets.push(new App.View.Widgets.Aq_cons.EnergySavingInfo({
      id_scope: this.scopeModel.get('id'),
      timeMode:'now',
    }));

    this.subviews.push(new App.View.Widgets.Container({
      widgets: this._widgets,
      el: this.$('.bottom .widgetContainer')
    }));
  }
});
