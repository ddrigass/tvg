import { EntitySize } from "@common/EntitySize";

export interface MapOptions {
    size: EntitySize | null
}

export interface IMap {
    options: MapOptions;
    layers: Object,
}