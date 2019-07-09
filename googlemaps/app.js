(function() {
  // Model
  const Marker = Backbone.Model.extend({
    defaults: {
      title: 'marker',
      latlng: [-34.397, 150.644],
    },
  });

  // Collection
  const Markers = Backbone.Collection.extend({
    model: Marker,
    initialize() {
      console.log('aaa');
    },
  });

  // View
  const MapView = Backbone.View.extend({
    el: '#content',
    template: _.template($('#googlemaps-template').html()),
    initialize() {
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.collection.on('add', this.handleAdd, this);
      this.collection.on('remove', this.handleRemove, this);
      this.render();
    },
    style: {
      width: '50%',
    },
    initMap() {
      const [lat, lng] = this.model.get('latlng');
      const mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      const mapDiv = this.el.querySelector('.googlemap');

      this.map = new google.maps.Map(mapDiv, mapOptions);

      google.maps.event.addListener(this.map, 'click', event => {
        this.collection.add({
          title: '',
          latlng: [event.latLng.lat(), event.latLng.lng()],
        });
      });
    },
    initMarker(marker) {
      if (marker) {
        this.addMarker(marker);
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      this.collection.each(m => {
        const marker = this.addMarker(m);
        bounds.extend(marker.getPosition());
      });
      this.map.fitBounds(bounds);
    },
    addMarker(markerInfo) {
      const [lat, lng] = markerInfo.get('latlng');
      const marker = new google.maps.Marker({
        map: this.map,
        draggable: false,
        position: { lat, lng },
        title: this.model.get('title'),
      });

      marker.addListener('click', event => {
        this.collection.remove(markerInfo);
        marker.setMap(null);
      });
      return marker;
    },
    initPolyline() {
      const directionsService = new google.maps.DirectionsService();
      const [origin, ...rest] = this.collection.each(marker => marker);
      const originLatLng = origin.get('latlng');
      const destinationLatLng = rest.pop().get('latlng');
      const waypointsLatLng = rest.map(point => {
        return {
          location: new google.maps.LatLng(
            point.get('latlng')[0],
            point.get('latlng')[1],
          ),
        };
      });

      /** polylineをレンダリングする際のオプション */
      this.directionsRenderer.setOptions({
        suppressMarkers: true, // マーカーを非表示にする場合はtrue
        preserveViewport: true, // zoomさせないようにする場合はtrue
        polylineOptions: {
          strokeOpacity: 1.0, // polylineの透明度0.0~1.0
          strokeWeight: 6, // polylineの幅（ピクセル）
          strokeColor: '#6991fd', // polylineの色
        },
      });

      /** directions apiへのリクエスト */
      directionsService.route(
        {
          origin: new google.maps.LatLng(originLatLng[0], originLatLng[1]), // 出発地
          waypoints: waypointsLatLng, // 経路（配列）
          destination: new google.maps.LatLng(
            destinationLatLng[0],
            destinationLatLng[1],
          ), // 到着地
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // directions apiのレスポンスをセット
            this.directionsRenderer.setMap(null);
            this.directionsRenderer.setDirections(response);
            this.directionsRenderer.setMap(this.map); // polylineを地図に表示
            return;
          }
          return console.log(`status: ${status}`);
        },
      );
    },
    handleAdd(marker) {
      this.initMarker(marker);
      this.initPolyline();
    },
    handleRemove() {
      this.initPolyline();
    },
    render() {
      this.$el.html(this.template(this.style));
      this.initMap();
      this.initMarker();
      this.initPolyline();
      return this;
    },
  });

  const marker = new Marker();
  const markers = new Markers([
    {
      title: '',
      latlng: [-34.397, 150.644],
    },
    {
      title: '',
      latlng: [-34.197, 150.544],
    },
  ]);
  const mapView = new MapView({ model: marker, collection: markers });
})();
