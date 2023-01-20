import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  ngOnInit(): void {
    this.createSvg();
    // Fetch JSON from an external endpoint
    type ChartDataType = {
      data: Array<Object>;
      message: string;
    };

    d3.json(
      'https://opendata.jabarprov.go.id/api-backend/bigdata/dinkes/od_17570_jumlah_kasus_hiv_berdasarkan_kelompok_umur'
    ).then((data: any) => {
      // console.log(data)
      const chartData = data as ChartDataType[];
      // console.log(JSON.stringify(chartData));
      this.drawBars(chartData);
    });
  }

  private svg: any;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: any[]): void {
    const result = JSON.parse(JSON.stringify(data)).data.reduce(function (
      r: any,
      a: any
    ) {
      r[a.kelompok_umur] = r[a.kelompok_umur] || [];
      r[a.kelompok_umur].push(a.jumlah_kasus);
      return r;
    },
    Object.create(null));

    const bars = Object.keys(result).reduce(function (previous, key) {
      const sum = result[key].reduce((total: any, item: any) => total + item);
      result[key] = sum;
      return result;
    }, []);

    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(Object.entries(bars).map((d: any) => d[0]))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 1000]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(Object.entries(bars))
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d[0]))
      .attr('y', (d: any) => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d[1]))
      .attr('fill', '#d04a35');
  }
}
