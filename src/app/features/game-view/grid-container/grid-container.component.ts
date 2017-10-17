import { AfterViewInit, Component, OnInit } from '@angular/core';

import { GridService } from '../shared-services/grid/grid.service';

@Component({
  selector: 'dlp-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.css']
})
export class GridContainerComponent implements OnInit, AfterViewInit {
  constructor(public gridService: GridService) { }

  ngOnInit() {
    console.log('Loader Start');
    this.gridService.initGrid();
  }

  ngAfterViewInit() {
    console.log('Loader End');
  }
}
