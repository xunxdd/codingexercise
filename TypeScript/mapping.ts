/// <reference path="./typings/googlemaps/google.maps.d.ts" />
/// <reference path="./typings/markerclustererplus/markerclustererplus.d.ts" />

module Mapping {
    interface IDeveloper {
        name: string;
        location: string;
        country: string;
        latitude: number;
        longitude: number;
        icontype: string;
    }
  
            
    export class GoogleMap {

        public name: string;
        private map: any;
        private options: any;

        constructor(mapDiv: Element, data: any[], type:string) {
            var devs: Array<IDeveloper> = data;
            var lats = [], longs=[];
            var center: number[];
            devs.map((value)=> {
                lats.push(value.latitude);
                longs.push(value.longitude);
            });
            center = this.getLatLngCenter(lats, longs);

            //console.log(center);
            this.name = "GoogleMap";

            this.options={ 
                center: { lat: center[0], lng: center[1] },
                scrollwheel: false,
                zoom: 2 

            };
 
            this.map = new google.maps.Map(mapDiv, this.options);

            switch(type) {
                case "heat":
                    this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                    this.addHeatMapLayer(data, this.map);
                    break;
                
                default:
                    this.makeMakers(data, this.map);
                    break;
            }
        }
        
        addHeatMapLayer(data, map){
            var points: google.maps.LatLng[] = [];
            var devs: Array<IDeveloper> = data;
            
            devs.map((value)=> {
                points.push(new google.maps.LatLng(value.latitude, value.longitude));
            });

            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: points,
                map: map
            });
         
        }

        makeMakers (data, map){
            var devs: Array<IDeveloper> = data;
            var iconMap: { [id: string]:string  } = {
                'us-il': 'dev1.png', 
                'us-nc': 'dev2.png', 
                'us-ca': 'dev3.png', 
                'us-md': 'dev4.png', 
                'us-wa': 'dev9.png', 
                'uk':'dev5.png',
                'sweden': 'dev6.png', 
                'agentina': 'dev7.png',
                'uruguay':'dev8.png'
            };
            var markers: google.maps.Marker[] = [];
 
            var bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
            for (var i = devs.length - 1; i >= 0; i--) {
                var dev = devs[i];
                var img = iconMap[dev.icontype ] || 'dev.png';
                var loc = new google.maps.LatLng(dev.latitude, dev.longitude);
                bounds.extend(loc);
                var opt: google.maps.MarkerOptions= {
                    position: loc,
                    map: map,
                    icon: 'images/' + img
               } ;
               var marker = new google.maps.Marker(opt);
               markers.push(marker);
             }
            
             map.fitBounds(bounds);
             var clusterOption: MarkerClustererOptions = {
                 maxZoom:  4,
                 gridSize: 3
             };
             var markerCluster = new MarkerClusterer(map, markers, clusterOption);
        }

        private rad2degr(rad: number):number { 
             return rad * 180 / Math.PI; 
         }
         
        private degr2rad(degr: number):number { 
             return degr * Math.PI / 180; 
         }

        private getLatLngCenter(lats:number[], longs:number[]):number[] {
                var sumX = 0;
                var sumY = 0;
                var sumZ = 0;
                var len=lats.length;

                for (var i=0; i<len; i++) {
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
         }

    }
}