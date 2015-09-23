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
                center: { lat: center[0], lng: center[1] },
                scrollwheel: false,
                zoom: 2
            };
            this.map = new google.maps.Map(mapDiv, this.options);
            switch (type) {
                case "heat":
                    this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                    this.addHeatMapLayer(data, this.map);
                    break;
                default:
                    this.makeMakers(data, this.map);
                    break;
            }
        }
        GoogleMap.prototype.addHeatMapLayer = function (data, map) {
            var points = [];
            var devs = data;
            devs.map(function (value) {
                points.push(new google.maps.LatLng(value.latitude,value.longitude));
            });
            console.log(points);
            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: points,
                map: map
            });
        };
        GoogleMap.prototype.makeMakers = function (data, map) {
            var devs = data;
            var iconMap = {
                'us-il': 'dev1.png',
                'us-nc': 'dev2.png',
                'us-ca': 'dev3.png',
                'us-md': 'dev4.png',
                'us-wa': 'dev9.png',
                'uk': 'dev5.png',
                'sweden': 'dev6.png',
                'agentina': 'dev7.png',
                'uruguay': 'dev8.png'
            };
            var markers = [];
            for (var i = devs.length - 1; i >= 0; i--) {
                var dev = devs[i];
                var img = iconMap[dev.icontype] || 'dev.png';
                var opt = {
                    position: new google.maps.LatLng(dev.latitude, dev.longitude),
                    map: map,
                    icon: 'images/' + img
                };
                var marker = new google.maps.Marker(opt);
                markers.push(marker);
            }
            var clusterOption = {
                maxZoom: 4,
                gridSize: 3
            };
            var markerCluster = new MarkerClusterer(map, markers, clusterOption);
        };
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
