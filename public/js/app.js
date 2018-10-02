var mapwizeMap
window.onload = function () {



  var art = [];
  var marker;
  var selectedPlace;

  const facilities = {
    wc: '5b921960e9fb4e0022eb95e3',
    restaurant: '5b917690db22200013722018',
    disabled: '5b921960e9fb4e0022eb95e3'
  }

  const initConfig = {
    bearing: 48.1,
    zoom: 19,
    floor: 1,
    center:[8.375177110719962, 47.42209953906886], //longLat
    userPosition: {
      latitude: 47.42209953906886,
      longitude: 8.375177110719962,
      floor: 1,
      accuracy: 8
    }
  }

  const placeTypesDepartments = [
    '57ff3c976e2cc00b00566a0d',
    '57285b8a7f0f7a0b0092cf5e'
  ]
  var departments = {};
  var allPlaces;

   Mapwize.apiKey('3d2dafbf53a14c95cee47c2348f9c5c3'); // This is a demo key, giving you access to the demo building. It is not allowed to use it for production. The key might change at any time without notice. Get your key by signin up at mapwize.io
   mapwizeMap = new Mapwize.Map({
     container: 'map',
     center: initConfig.center,
     zoom: initConfig.zoom,
     bearing: initConfig.bearing,
     userPosition: true,
     maxBounds: [ [8.374355309642853, 47.42066766240786], [8.377269508782776, 47.4226107356658] ], // Need to be LngLatBoundsLike: https://www.mapbox.com/mapbox-gl-js/api/#lnglatboundslike
   }, {
     venueId: '5b8ffe23051cd90021bd526f'
  });

   mapwizeMap.on('mapwize:ready', e => {
     console.log('Maps is now ready to be used')
     mapwizeMap.setFloor(initConfig.floor);
     mapwizeMap.setUserPosition(initConfig.userPosition);

     mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-size',18);
     mapwizeMap.setLayoutProperty('position','icon-size',1);
     mapwizeMap.setLayoutProperty('mapwize_places_symbol','icon-size',0.4);
     mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-offset',[0,0.4]);
     mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-optional',false);
     mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-anchor','center');
     mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-anchor','top');

     mapwizeMap.setPaintProperty("mapwize_places_fill", 'fill-color', '#FFFFFF');
     mapwizeMap.setPaintProperty("mapwize_places_fill", 'fill-opacity', 0);
     mapwizeMap.setPaintProperty("mapwize_directions_dash", 'line-color', '#FAD23C');

     mapwizeMap.on('mapwize:venueenter', venue => {
       loadPlaces();
     });

     mapwizeMap.on('mapwize:floorchange', floor => {
       app.selectedFloor = floor.floor;
     });

     mapwizeMap.on('mapwize:click', e => {
       if (e.place !== null){
         showPlace(e.place);
         app.navigateDisabled = false;
       }
          // app.name = e.place.name;
          // app.articles = e.place.data ? e.place.data.articles : [];
     })
   }); //ON map:ready

   var initPosition = () => {
     mapwizeMap.setFloor(initConfig.floor);
     mapwizeMap.setUserPosition(initConfig.userPosition);
     mapwizeMap.setBearing(initConfig.bearing);
     mapwizeMap.setZoom(initConfig.zoom);
     mapwizeMap.setCenter(initConfig.center);
     app.selectedFloor = initConfig.floor;
   }

    var showPlace = (place)=>{
      if (place !== null){
        if (marker !== undefined){mapwizeMap.removeMarker(marker);}
        mapwizeMap.addMarkerOnPlace(place).then(_marker => {
           // do something or store marker reference
           marker = _marker
         }).catch(err => {
             // Error, if any
         });
        mapwizeMap.centerOnPlace(place);
        selectedPlace = place;
      };
    } //showplace
    var changeFloor = (floor) => {
        app.selectedFloor = floor;
        mapwizeMap.setFloor(floor);
    }

    var navigate = () => {
      if (selectedPlace === undefined){return false;}
       Mapwize.Api.getDirection({
        from: {
          latitude: 47.42209953906886,
          longitude: 8.375177110719962,
          floor: 1
        },
        to: {
          placeId: selectedPlace._id
        },
        waypoints: [],
        options: {}
        }).then(direction => {
          mapwizeMap.setDirection(direction);
        });
    } //navigate

    var loadPlaces = () => {
      Mapwize.Api.getPlaces({
        venueId: '5b8ffe23051cd90021bd526f'
      }).then(places => {
        var floors = mapwizeMap.getFloors();
        floors.sort();
        console.log(places);
        allPlaces = Object.assign({}, places);
        departments = floors.map((currentValue)=>(departments[currentValue] = []));
        places.forEach((element)=>{
          const floor = element.floor;
          const exist = placeTypesDepartments.indexOf(element.placeTypeId);
          if (exist !== -1){
            departments[floor].push(element);
          }
        })
        console.log(departments);
        console.log(allPlaces);
        app.departments = departments;
      });
    }

    var findPlaceById = (placeId) => {
      if (allPlaces === undefined) {return false;}
      const i = Object.values(allPlaces);
      return i.find((element)=>{
        return element._id === placeId ? true : false;
      })
    };



      var app = new Vue({
        el: '#app',
        data: {
          name: '',
          articles: art,
          departments: departments,
          navDisplay: false,
          distance: '',
          time: '',
          selectedFloor : initConfig.floor,
          navigateDisabled: false,
          map: mapwizeMap
        },
        computed: {
/*          selectedFloor: function() {
            return this.content['cravings'] ? 'fa-checkbox-marked' : 'fa-checkbox-blank-outline';
          }*/
        },
        methods: {
          clickOnPlace: function (place){
            showPlace(place);
            this.navigateDisabled = false;
          },
          clickOnFloor: function (floor)  {
            changeFloor(floor);
          },
          clickOnNavigate: function (event) {
            navigate();
            this.navDisplay= true;
          },
          clickOnCancelNavigate: function (event)  {
            mapwizeMap.removeDirection();
            initPosition();
            this.navigateDisabled = true;
            this.navDisplay = false;

          },
          clickOnGoTo: function(placeName)  {
            const _place = findPlaceById(facilities[placeName]);
            console.log(_place);
            showPlace(_place);
            navigate();
            this.navDisplay = true;
          }
        }
      }); //VUE
 }
