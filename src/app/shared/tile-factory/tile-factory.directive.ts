import {
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";

import {
  LooComponent,
  NoneComponent,
  MoneyComponent,
  PizzaComponent,
  PlayerComponent,
  WallComponent,
  PoopComponent
} from "./";

import { TILE_TYPES } from "../../features/game-view/services/";

@Directive({
  selector: "[dlp-tile-factory]"
})
export class TileFactoryDirective implements OnInit {
  private _tileType: string;
  @Input("dlp-tile-factory") set cellData(value: string) {
    this._tileType = value;

    this.renderComponent();
  }

  tiles = {
    wall: WallComponent, // Unpassable
    poop: PoopComponent, // Unhealthy
    none: NoneComponent, // Drop zone, Passable
    loo: LooComponent, // Long Term Goal

    // Short Term Goals
    pizza: PizzaComponent,
    money: MoneyComponent,

    player: PlayerComponent
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.renderComponent();
  }

  private renderComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponents()
    );
    this.viewContainerRef.clear();
    this.viewContainerRef.createComponent(componentFactory);
  }

  private getComponents() {
    let tileComponent = this.tiles[this._tileType];

    if (!tileComponent) {
      return this.tiles[TILE_TYPES.NONE];
    }

    return tileComponent;
  }
}
