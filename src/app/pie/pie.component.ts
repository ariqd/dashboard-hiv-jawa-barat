import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {
  ngOnInit(): void {
    this.createSvg();
    // this.createColors();
    // this.drawChart();

    type ChartDataType = {
      data: Array<Object>;
      message: string;
    };

    d3.json(
      'https://opendata.jabarprov.go.id/api-backend/bigdata/dinkes/od_17569_jumlah_kasus_hiv_berdasarkan_jenis_kelamin'
    ).then((data: any) => {
      const chartData = data as ChartDataType[];
      const result = JSON.parse(JSON.stringify(chartData)).data.reduce(function (
        r: any,
        a: any
      ) {
        r[a.jenis_kelamin] = r[a.jenis_kelamin] || [];
        r[a.jenis_kelamin].push(a.jumlah_kasus);
        return r;
      },
      Object.create(null));

      const pieData = Object.keys(result).reduce(function (previous, key) {
        const sum = result[key].reduce((total: any, item: any) => total + item);
        result[key] = sum;
        return result;
      }, []);

      this.createColors(pieData);
      this.drawChart(pieData);
    });
  }

  private svg: any;
  private margin = 50;
  private width = 600;
  private height = 400;

  // The radius of the poe chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  private createSvg(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(pieData: any): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(Object.entries(pieData).map((d: any) => d[1]))
      .range(['#c7d3ec', '#5a6782']);
  }

  private drawChart(pieData: any): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d[1]));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(Object.entries(pieData)))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add Labels
    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);
    this.svg
      .selectAll('pieces')
      .data(pie(Object.entries(pieData)))
      .enter()
      .append('text')
      .text((d: any) => `${d.data[0]}: ${d.data[1]}`)
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 16);
  }
}
