import { Component, Input } from '@angular/core';

import { TILE_TYPES } from '../shared-services/grid/grid.model';

@Component({
  selector: 'dlp-emoji-factory',
  templateUrl: './emoji-factory.component.html',
  styleUrls: ['./emoji-factory.component.css']
})
export class EmojiFactoryComponent {
  @Input() tileType: TILE_TYPES;

  tile_types = TILE_TYPES;
}
