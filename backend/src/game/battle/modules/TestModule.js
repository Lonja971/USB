import { Module } from "./Module.js";

export class TestModule extends Module{
   constructor(data) {
      const { entityData, positionOffset } = data;
      super({
         ...data,
         entityData,
         positionOffset: positionOffset,
         health: 2
      });
   }
}