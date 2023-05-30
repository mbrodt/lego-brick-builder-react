import { Vector3, Box3 } from "three"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js"
import { Wireframe } from "three/examples/jsm/lines/Wireframe.js"
import { WireframeGeometry2 } from "three/examples/jsm/lines/WireframeGeometry2.js"
function AABB(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}
import { lightenDarkenColor } from "@/js/utils"

export class Brick {
  constructor({
    mesh,
    graphic,
    defaultColor,
    id,
    scene,
    texture,
    completionColliderMesh,
  } = {}) {
    Object.assign(this, {
      mesh,
      graphic,
      defaultColor,
      id,
      scene,
      texture,
      completionColliderMesh,
    })

    this.setup()
    this.makeBoundingBox()
    this.updateBoundingBox()
    this.makeConnectionProperties()

    const wireframeGeometry = new WireframeGeometry2(mesh.geometry)

    const wireframeBorder = new LineMaterial({
      color: 0xff0000,
      linewidth: 0.002,
    })

    // Setup the collision wireframe used to display when bricks are colliding
    this.collidingFrame = new Wireframe(wireframeGeometry, wireframeBorder)
    this.collidingFrame.position.set(...this.mesh.position)
    this.collidingFrame.visible = false
    this.scene.add(this.collidingFrame)

    // We scale the graphic down on the x and z axis to make tiny gaps between the brick models to better identify each individual brick
    this.graphic.scale.set(0.997, 1, 0.997)

    this.positionEase = new Vector3(0, 0, 0)
    this.positionOffset = new Vector3(0, 0, 0)
    this.rotationOffset = new Vector3(0, 0, 0)
    this.rotationEase = 0
    this.isHovering = false
  }
  setup() {
    this.mesh.$ = this
  }
  get uuid() {
    return this.mesh.uuid
  }
  get hexDefaultColor() {
    return `#${this.defaultColor.getHexString()}`
  }
  makeBoundingBox() {
    this.boundingBox = new Box3().setFromObject(this.mesh)
    this.completionBoundingBox = new Box3().setFromObject(
      this.completionColliderMesh
    )
  }
  updateBoundingBox() {
    this.boundingBox.setFromObject(this.mesh)
    this.completionBoundingBox.setFromObject(this.completionColliderMesh)
  }
  update() {
    this.positionEase.set(...this.mesh.position.toArray())
    this.positionEase.sub(this.graphic.position)
    this.positionEase.multiplyScalar(0.25)
    this.graphic.position.add(this.positionEase)
    this.graphic.position.add(this.positionOffset)
    this.collidingFrame.position.add(this.positionEase)
    this.collidingFrame.position.add(this.positionOffset)

    this.rotationEase = (this.mesh.rotation.y - this.graphic.rotation.y) * 0.25
    this.graphic.rotation.y += this.rotationEase
    this.graphic.rotation.y = this.graphic.rotation.y + this.rotationOffset.y
    this.collidingFrame.rotation.y += this.rotationEase
    this.collidingFrame.rotation.y =
      this.graphic.rotation.y + this.rotationOffset.y

    this.completionColliderMesh.position.copy(this.mesh.position)
    this.completionColliderMesh.rotation.copy(this.mesh.rotation)
  }

  hovering() {
    this.positionOffset.y = 0.075
    this.isHovering = true
    this.highlightColor()
  }
  highlightColor() {
    const lighterColor = lightenDarkenColor(
      this.defaultColor.getHexString(),
      90
    )
    this.graphic?.children?.forEach((child) => {
      child.material[0].color.setHex(`0x${lighterColor}`)
    })
    this.hideCollisionFrame()
  }
  showCollisionFrame() {
    this.isColliding = true
    // Add a small timeout to prevent the wireframe from flickering when bricks only collide as part of a legal move before the move is completed
    setTimeout(() => {
      if (this.isColliding) {
        this.collidingFrame.visible = true
      }
    }, 100)
  }
  hideCollisionFrame() {
    this.isColliding = false
    this.collidingFrame.visible = false
  }

  resetColor() {
    this.graphic?.children?.forEach((child) => {
      child.material[0].color.setHex(`0x${this.defaultColor.getHexString()}`)
    })
    this.hideCollisionFrame()
  }
  gluing() {
    this.graphic.rotation.x = 0
    this.graphic.rotation.z = 0
    this.collidingFrame.rotation.x = 0
    this.collidingFrame.rotation.z = 0
    this.positionOffset.y = 0.075
  }
  stationary() {
    this.graphic.rotation.x = 0
    this.graphic.rotation.z = 0
    this.collidingFrame.rotation.x = 0
    this.collidingFrame.rotation.z = 0
    this.positionOffset.y = 0
    this.isHovering = false
    this.resetColor()
  }

  completionBoundingBoxIntersects(box) {
    const intersects = this.completionBoundingBox.intersectsBox(box)
    return intersects
  }
  makeConnectionProperties() {
    this.collided = []

    this.below = []
  }
  addCollided(item) {
    if (this.collided.indexOf(item) === -1) {
      this.collided.push(item)
    }
  }
  hasCollided() {
    return this.collided.length
  }
  clearCollided() {
    this.collided = []
  }
  removeCollided(item) {
    this.collided = this.collided.filter((a) => a != item)
  }

  addBelow(item) {
    if (this.below.indexOf(item) === -1) {
      this.below.push(item)
    }
  }
  setBelow(items) {
    this.below = items
  }
  removeBelow(item) {
    this.below = this.below.filter((a) => a != item)
  }
  hasBelow() {
    return this.below.length
  }
  clearBelow() {
    this.below = []
  }
  data() {
    return {
      id: this.id,
      color: this.hexDefaultColor,
      uuid: this.mesh.uuid,
      position: this.mesh.position,
      rotation: this.mesh.rotation,
      texture: this.texture,
      mesh: this.mesh,
      completionBoundingBox: this.completionBoundingBox,
      completionBoundingBoxIntersects: this.completionBoundingBoxIntersects,
    }
  }
  testableData() {
    return {
      id: this.id,
      uuid: this.mesh.uuid,
      below: this.below.map((a) => a.testableData()),
    }
  }
  getIntersectingPlanes(collection, condition = () => true) {
    const {
      max: { x: maxX1, z: maxZ1, y: maxY1 },
      min: { x: minX1, z: minZ1, y: minY1 },
    } = this.boundingBox
    const x1 = minX1
    const z1 = minZ1
    const w1 = maxX1 - minX1
    const d1 = maxZ1 - minZ1

    return collection.filter((item) => {
      const {
        max: { x: maxX2, z: maxZ2, y: maxY2 },
        min: { x: minX2, z: minZ2, y: minY2 },
      } = item.boundingBox
      const x2 = minX2
      const z2 = minZ2
      const w2 = maxX2 - minX2
      const d2 = maxZ2 - minZ2
      return (
        AABB(x1, z1, w1, d1, x2, z2, w2, d2) &&
        condition?.({ maxY1, minY1, maxY2, minY2 })
      )
    })
  }
  getIntersectingCollidedBricks() {
    return this.getIntersectingPlanes(this.collided)
  }
  getIntersectingBelowBricks() {
    return this.getIntersectingPlanes(this.below)
  }
}
