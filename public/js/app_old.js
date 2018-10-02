var mapwizeMap

 window.onload = function () {
   Mapwize.apiKey('3d2dafbf53a14c95cee47c2348f9c5c3'); // This is a demo key, giving you access to the demo building. It is not allowed to use it for production. The key might change at any time without notice. Get your key by signin up at mapwize.io
   mapwizeMap = new Mapwize.Map({
     container: 'map'
   }, {});

   mapwizeMap.on('mapwize:ready', e => {
     console.log('Maps is now ready to be used')

     mapwizeMap.on('mapwize:click', e => {
       console.log('mapwize:click', e);
     })
   });
 }




      //Define the bounds of the map
      var bounds = new L.LatLngBounds(
              new L.LatLng(47.422932, 8.373202),
              new L.LatLng(47.420236, 8.378015)
      );

      var art = [];
      //Create the map

      var place;

      var app = new Vue({
        el: '#app',
        data: {
          name: '',
          articles: art,
          navigation: false,
          distance: '',
          time: ''
        }
      })

      var navigate = function(){
        console.log("r342");
        map.showDirections({
          latitude: 47.42209953906886,
          longitude: 8.375177110719962,
          floor: 1
        }, {
          placeId: place._id
        }, {}, {}, function(err, directions){
          if (err){
            return console.log(error);
          }
          app.distance = Math.floor(directions.distance) + 'm';
          app.time = new Date(1000 * Math.floor(directions.traveltime)).toISOString().substr(11, 8) + 's';
          app.navigation = true;
        });
      }
      //use maxBounds to limit the visible area
      var map = Mapwize.map('map', {
          apiKey: '3d2dafbf53a14c95cee47c2348f9c5c3',                             // Key to gain access to the demo building
          maxBounds: [ [47.422932, 8.373202], [47.420236, 8.378015] ],
          zoom: 21,
          floor: 1,
          center: [47.42209953906886, 8.375177110719962],
          showUserPositionControl: false

      });

      map.centerOnPlace('5b9166237bfe470036ad4d2a');
      //Fits the bounds of the map so the entire region is visible.
    //  map.fitBounds(bounds);

      map.on('click', function(e){
          //console.log('You just clicked on the map at location ' + e.latlng);
      });

      map.on('placeClick', function(e){
          console.log(e);
          map.centerOnPlace(e.place);

            app.name = e.place.name;
            app.articles = e.place.data ? e.place.data.articles : [];
            place = e.place;

      });


      map.on('venueEnter', function (e) {
        map.addMarker({
          latitude: 47.42209953906886,
          longitude: 8.375177110719962,
          floor: 1});
      });


      map.on('floorChanged', function(e){
          console.log('Floor changed to ' + e.floor);
      });

      map.on('floorsChanged', function(e){
        //  console.log('Available floors at position changed to ' + e.floors);
      });
      map.setUserPosition({
        latitude: 47.42209953906886,
        longitude: 8.375177110719962,
        floor: 1,
        accuracy: 1
      });
      map.addMarker({
        latitude: 47.42209953906886,
        longitude: 8.375177110719962,
        floor: 1
      })

      map.addMarker({
        latitude: 47.422,
        longitude: 8.375,
        floor: 1
      }, function (err, markerId) {
        if (err) {
          return console.error('addMarker failed', err);
        }
        //map.removeMarker(markerId);
      });
