import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as geojson from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  constructor(private http: HttpClient) {}

  private cities: Object;

  ngOnInit(): void {
    let map: L.Map;
    let geojson: L.GeoJSON;

    map = L.map('map').setView([-6.9175, 107.6191], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    let info;

    info = new L.Control();

    info.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props: any) {
      this._div.innerHTML =
        '<h4>Jumlah Kasus HIV</h4>' +
        (props
          ? '<b>' +
            props.name +
            '</b><br />' +
            props.density +
            ' people / mi<sup>2</sup>'
          : 'Hover over a state');
    };

    info.addTo(map);

    function getColor(d: any) {
      return d > 1000
        ? '#800026'
        : d > 500
        ? '#BD0026'
        : d > 200
        ? '#E31A1C'
        : d > 100
        ? '#FC4E2A'
        : d > 50
        ? '#FD8D3C'
        : d > 20
        ? '#FEB24C'
        : d > 10
        ? '#FED976'
        : '#FFEDA0';
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: '#fff',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    }

    function highlightFeature(e: any) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
      });

      layer.bringToFront();

      info.update(layer.feature.properties);
    }

    function resetHighlight(e: any) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e: any) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature: any, layer: L.Layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    }
    // this.getCities('Kota Bandung')
    // console.log(this.getCities('Kota Bandung'));

    this.http
      .get(
        'https://opendata.jabarprov.go.id/api-backend/bigdata/dinkes/od_18510_jumlah_kasus_hiv_berdasarkan_kabupatenkota'
      )
      .subscribe((mapResponse: any) => {
        let mapArray = [];

        const result = mapResponse.data.reduce(function (r: any, a: any) {
          r[a.nama_kabupaten_kota] = r[a.nama_kabupaten_kota] || [];
          r[a.nama_kabupaten_kota].push({
            jumlah_kasus: a.jumlah_kasus,
            tahun: a.tahun,
          });
          return r;
        }, []);

        // var geojsonPoint: geojson.Polygon = {
        //   type: 'Polygon',
        //   coordinates: [
        //     [
        //       [-109.042503, 37.000263],
        //       [-109.04798, 31.331629],
        //       [-111.074448, 31.331629],
        //       [-112.246513, 31.704061],
        //       [-114.815198, 32.492741],
        //       [-114.72209, 32.717295],
        //       [-114.524921, 32.755634],
        //       [-114.470151, 32.843265],
        //       [-114.524921, 33.029481],
        //       [-114.661844, 33.034958],
        //       [-114.727567, 33.40739],
        //       [-114.524921, 33.54979],
        //       [-114.497536, 33.697668],
        //       [-114.535874, 33.933176],
        //       [-114.415382, 34.108438],
        //       [-114.256551, 34.174162],
        //       [-114.136058, 34.305608],
        //       [-114.333228, 34.448009],
        //       [-114.470151, 34.710902],
        //       [-114.634459, 34.87521],
        //       [-114.634459, 35.00118],
        //       [-114.574213, 35.138103],
        //       [-114.596121, 35.324319],
        //       [-114.678275, 35.516012],
        //       [-114.738521, 36.102045],
        //       [-114.371566, 36.140383],
        //       [-114.251074, 36.01989],
        //       [-114.152489, 36.025367],
        //       [-114.048427, 36.195153],
        //       [-114.048427, 37.000263],
        //       [-110.499369, 37.00574],
        //       [-109.042503, 37.000263],
        //     ],
        //   ],
        // };
        // L.geoJSON(geojsonPoint).addTo(map);
        // geojson = L.geoJson(statesData, {
        //   style: style,
        //   onEachFeature: onEachFeature,
        // }).addTo(map);

        Object.keys(result).map((key) => {
          const sum = result[key].reduce(
            (total: any, item: any) => total + parseInt(item.jumlah_kasus),
            0
          );

          const urlKey = key.replace(/ /g, '+');

          this.http
            .get(
              'https://nominatim.openstreetmap.org/search.php?q=' +
                urlKey +
                '&polygon_geojson=1&format=json'
            )
            .subscribe((jsonResponse: any) => {
              console.log(jsonResponse);
              // const response = jsonResponse.cities.find(
              //   (element) => element.name === key
              // );
              // mapArray.push({
              //   KabupatenKota: key,
              //   JumlahKasus: sum,
              //   latitude: response.latitude,
              //   longitude: response.longitude,
              // });
            });
        });

        console.log(mapArray);
      });
  }
}
