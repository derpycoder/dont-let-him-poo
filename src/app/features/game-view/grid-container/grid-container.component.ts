import { Component, OnInit } from '@angular/core';

import { GridCreationService } from '../services/grid/grid-creation.service';

@Component({
  selector: 'dlp-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.css']
})
export class GridContainerComponent implements OnInit {
  constructor(public gridService: GridCreationService) { }

  ngOnInit() {
    if(!this.gridService.gameGrid) {
      this.gridService.initGrid();
    }
  }
}
