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

  ngOnInit(): void {
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

          mapArray.push({
            KabupatenKota: key,
            JumlahKasus: sum,
          });
        });

        console.log(mapArray);
      });
  }
}
