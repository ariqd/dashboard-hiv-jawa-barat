import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as d3 from 'd3';

@Component({
  selector: 'app-barCities',
  templateUrl: './barCities.component.html',
  styleUrls: ['./barCities.component.css'],
})
export class BarCitiesComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.createSvg();

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

        // console.log(mapArray);
        this.drawBars(mapArray);
      });
  }

  private svg: any;
  private margin = { top: 20, right: 30, bottom: 40, left: 150 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 800 - this.margin.top - this.margin.bottom;

  private createSvg(): void {
    this.svg = d3
      .select('figure#barCities')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  private drawBars(barChartData: any[]): void {
    barChartData = barChartData.sort((a, b) => b.JumlahKasus - a.JumlahKasus);
    console.log(barChartData);

    var x = d3.scaleLinear().domain([0, 2000]).range([0, this.width]);
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    var y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(
        barChartData.map(function (d) {
          return d.KabupatenKota;
        })
      )
      .padding(0.1);
    this.svg.append('g').call(d3.axisLeft(y));

    this.svg
      .selectAll('myRect')
      .data(barChartData)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', function (d) {
        return y(d.KabupatenKota);
      })
      .attr('width', function (d) {
        return x(d.JumlahKasus);
      })
      .attr('height', y.bandwidth())
      .attr('fill', '#69b3a2');

    this.svg
      .selectAll('.text')
      .data(barChartData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', function (d) {
        return x(d.JumlahKasus);
      })
      .attr('y', function (d) {
        return y(d.KabupatenKota) + 5;
      })
      .attr('dy', '.75em')
      .text(function (d) {
        return d.JumlahKasus;
      });

    // this.svg
    //   .selectAll('text')
    //   .data(barChartData)
    //   .enter()
    //   .append('text')
    //   .text(function (d) {
    //     return d.JumlahKasus;
    //   })
    //   .attr('text-anchor', 'middle')
    //   .attr('fill', 'white')
    //   .attr('x', function (d, i) {
    //     return i * (this.width / barChartData.length);
    //   })
    //   .attr('y', function (d) {
    //     return this.height - d * 4;
    //   });
  }
}
