import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { json } from 'd3';

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

        Object.keys(result).map((key) => {
          const sum = result[key].reduce(
            (total: any, item: any) => total + parseInt(item.jumlah_kasus),
            0
          );

          this.http.get('assets/cities.json').subscribe((jsonResponse: any) => {
            const response = jsonResponse.cities.find(
              (element) => element.name === key
            );
            mapArray.push({
              KabupatenKota: key,
              JumlahKasus: sum,
              latitude: response.latitude,
              longitude: response.longitude,
            });
          });
        });

        console.log(mapArray);

        // geojson = L.geoJson(statesData, {
        //   style: style,
        //   onEachFeature: onEachFeature,
        // }).addTo(map);
      });
  }
}
