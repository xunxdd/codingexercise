/// <reference path="./typings/googlemaps/google.maps.d.ts" />
/// <reference path="./typings/markerclustererplus/markerclustererplus.d.ts" />
var Mapping;
(function (Mapping) {
    var GoogleMap = (function () {
        function GoogleMap(mapDiv, data, type) {
            var devs = data;
            var lats = [], longs = [];
            var center;
            devs.map(function (value) {
                lats.push(value.latitude);
                longs.push(value.longitude);
            });
            center = this.getLatLngCenter(lats, longs);
            //console.log(center);
            this.name = "GoogleMap";
            this.options = {
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                center: { lat: center[0], lng: center[1] },
                scrollwheel: false,
                zoom: 6
            };
            this.map = new google.maps.Map(mapDiv, this.options);
            
            this.oms=this.setUpOms(this.map);
            this.makeMakers(data, this.map, this.oms);
        }

        GoogleMap.prototype.setUpOms= function(map){
            var oms = new OverlappingMarkerSpiderfier(map, {
                    circleSpiralSwitchover:0,
                    keepSpiderfied:true,
                    markersWontMove: true, 
                    markersWontHide: true
                }),
                iw =new google.maps.InfoWindow(),
                spiderfiedColor = 'ffee22',
                usualColor = 'eebb22';
            
            oms.addListener('click', function(marker, event) {
                iw.setContent(marker.desc);
                iw.open(map, marker);
            });


          oms.addListener('spiderfy', function(markers) {
            for(var i = 0; i < markers.length; i ++) {
              markers[i].setIcon(this.iconWithColor(spiderfiedColor));
              markers[i].setShadow(null);
            } 
            iw.close();
          });

          oms.addListener('unspiderfy', function(markers) {
            for(var i = 0; i < markers.length; i ++) {
              markers[i].setIcon(this.iconWithColor(usualColor));
              markers[i].setShadow(shadow);
            }
         });
          
          oms.addListener('spiderfy', function(markers) {
                iw.close();
           });
           return oms;
        }

        GoogleMap.prototype.makeMakers = function (data, map, oms) {
            var devs = data;
            var usualColor = 'eebb22';
            var shadow = new google.maps.MarkerImage(
               'https://www.google.com/intl/en_ALL/mapfiles/shadow50.png',
               new google.maps.Size(60, 60),  // size   - for sprite clipping
               new google.maps.Point(0, 0),   // origin - ditto
               new google.maps.Point(10, 34)  // anchor - where to meet map location
            ),
            bounds = new google.maps.LatLngBounds();
            
            for (var i = devs.length - 1; i >= 0; i--) {
                var dev = devs[i];
                var loc = new google.maps.LatLng(dev.latitude, dev.longitude);
                bounds.extend(loc);
                var opt = {
                    position: loc,
                    shadow:shadow,
                    map: map,
                    title:'Multiple troopers'
                };
                var marker = new google.maps.Marker(opt);
                marker.desc = 'dev invasion';
                oms.addMarker(marker);
            }
            
            map.fitBounds(bounds);

        };

        GoogleMap.prototype.iconWithColor= function(color){
            return 'http://chart.googleapis.com/chart?chst=d_map_xpin_letter&chld=pin|+|' +color + '|000000|ffff00';
        }

        GoogleMap.prototype.rad2degr = function (rad) {
            return rad * 180 / Math.PI;
        };
        GoogleMap.prototype.degr2rad = function (degr) {
            return degr * Math.PI / 180;
        };
        GoogleMap.prototype.getLatLngCenter = function (lats, longs) {
            var sumX = 0;
            var sumY = 0;
            var sumZ = 0;
            var len = lats.length;
            for (var i = 0; i < len; i++) {
                var lat = this.degr2rad(lats[i]);
                var lng = this.degr2rad(longs[i]);
                // sum of cartesian coordinates
                sumX += Math.cos(lat) * Math.cos(lng);
                sumY += Math.cos(lat) * Math.sin(lng);
                sumZ += Math.sin(lat);
            }
            var avgX = sumX / len;
            var avgY = sumY / len;
            var avgZ = sumZ / len;
            // convert average x, y, z coordinate to latitude and longtitude
            var lng = Math.atan2(avgY, avgX);
            var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
            var lat = Math.atan2(avgZ, hyp);
            return ([this.rad2degr(lat), this.rad2degr(lng)]);
        };
        return GoogleMap;
    })();
    Mapping.GoogleMap = GoogleMap;
})(Mapping || (Mapping = {}));
