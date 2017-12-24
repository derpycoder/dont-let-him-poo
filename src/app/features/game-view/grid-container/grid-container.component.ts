import { Component, OnInit } from '@angular/core';

import { GridService } from '../services/grid/grid.service';

@Component({
  selector: 'dlp-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.css']
})
export class GridContainerComponent implements OnInit {
  constructor(public gridService: GridService) { }

  ngOnInit() {
    if(!this.gridService.gameGrid) {
      this.gridService.initGrid();
    }
  }
}
