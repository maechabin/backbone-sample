(function() {
  const MapView = Backbone.View.extend({
    el: '#content',
    template: _.template($('#googlemaps-template').html()),
    initialize() {
      this.render();
    },
    style: {
      width: '50%',
    },
    initMap() {
      const mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      const mapDiv = this.el.querySelector('.googlemap');

      this.map = new google.maps.Map(mapDiv, mapOptions);
    },
    render() {
      this.$el.html(this.template(this.style));
      this.initMap();
      return this;
    },
  });

  var mapView = new MapView();
})();
