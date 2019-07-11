(function() {
  // Model
  const Point = Backbone.Model.extend({
    defaults: {
      latlng: [-34.397, 150.644],
    },
  });

  // Collection
  const Points = Backbone.Collection.extend({
    model: Point,
    initialize() {},
  });

  // View
  const MapView = Backbone.View.extend({
    el: '#content',
    template: _.template($('#googlemaps-template').html()),
    preinitialize() {},
    initialize() {
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.prevMarker = { marker: null, latlng: null };
      this.collection.on('add', this.handleAdd, this);
      this.collection.on('remove', this.handleRemove, this);
      this.collection.on('change', this.handleChange, this);
      this.render();
    },
    style: {
      width: '50%',
    },
    initMap() {
      const [lat, lng] = this.model.get('point').get('latlng');
      const mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      const mapDiv = this.el.querySelector('.googlemap');

      this.map = new google.maps.Map(mapDiv, mapOptions);

      google.maps.event.addListener(this.map, 'click', event => {
        console.log(`${event.latLng.lat()}, ${event.latLng.lng()}`);
        this.collection.add({
          latlng: [event.latLng.lat(), event.latLng.lng()],
        });
      });
    },
    initMarker(point) {
      if (point) {
        this.addMarker(point);
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      this.collection.each(point => {
        const marker = this.addMarker(point);
        bounds.extend(marker.getPosition());
      });
      this.map.fitBounds(bounds);
    },
    addMarker(point) {
      const [lat, lng] = point.get('latlng');
      const icon =
        point.id === 1 || point.id === 2
          ? 'https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1'
          : 'https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png';
      const marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        position: { lat, lng },
        icon,
      });

      marker.addListener('click', event => {
        if (point.id === 1 || point.id === 2) {
          return;
        }
        this.collection.remove(point);
        marker.setMap(null);
      });

      marker.addListener('dragend', event => {
        this.prevMarker = {
          ...this.prevMarker,
          marker,
          latlng: point.get('latlng'),
        };
        point.set({ latlng: [event.latLng.lat(), event.latLng.lng()] });
        console.log(`${event.latLng.lat()}, ${event.latLng.lng()}`);
      });

      return marker;
    },
    initPolyline(isError) {
      const directionsService = new google.maps.DirectionsService();
      const [origin, destination, ...waypoints] = this.collection.each(
        point => point,
      );
      const originLatLng = origin.get('latlng');
      const destinationLatLng = destination.get('latlng');
      const waypointsLatLng = waypoints.map(waypoint => {
        return {
          location: new google.maps.LatLng(
            waypoint.get('latlng')[0],
            waypoint.get('latlng')[1],
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
          strokeColor: '#0072f1', // polylineの色
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
          travelMode: google.maps.TravelMode.WALKING,
          optimizeWaypoints: true, // 経路を最適化
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // directions apiのレスポンスをセット
            this.directionsRenderer.setMap(null);
            this.directionsRenderer.setDirections(response);
            this.directionsRenderer.setMap(this.map); // polylineを地図に表示
            if (isError) {
              isError(false);
            }
            return;
          }

          alert(`status: ${status}`);
          if (isError) {
            isError(true);
          }
        },
      );
    },
    handleAdd(point) {
      this.initPolyline(isError => {
        if (isError) {
          this.collection.remove(point);
        } else {
          this.initMarker(point);
        }
      });
    },
    handleRemove() {
      this.initPolyline();
    },
    handleChange(point) {
      this.initPolyline(isError => {
        if (isError) {
          const [lat, lng] = this.prevMarker.latlng;
          this.prevMarker.marker.setPosition(new google.maps.LatLng(lat, lng));
          point.set({ latlng: this.prevMarker.latlng });
        }
      });
    },
    render() {
      this.$el.html(this.template(this.style));
      this.initMap();
      this.initMarker();
      this.initPolyline();
      return this;
    },
  });

  const ButtonView = Backbone.View.extend({
    el: '.button',
    events: {
      click: 'handleClick',
    },
    handleClick() {
      mapView.collection.reset(initialData);
      mapView.render();
    },
  });

  const initialData = [
    {
      id: 1,
      latlng: [35.70297300018472, 139.90232151621774],
    },
    {
      id: 2,
      latlng: [35.583059491197396, 139.63348388671875],
    },
  ];
  const point = new Point();
  const latlng = new Point();
  const points = new Points(initialData);

  const model = new Backbone.Model();
  model.set({
    point,
    latlng,
  });

  const mapView = new MapView({
    model,
    collection: points,
  });
  const buttonView = new ButtonView();
})();
