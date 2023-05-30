import * as THREE from "three"
export class Scene extends THREE.Scene {
  constructor(args) {
    super()
    Object.assign(this, args)
    this.$mounted()
  }
  $mounted() {}
}
