import {
  Color,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  GridHelper,
  Fog,
  DirectionalLight,
  AmbientLight,
  Vector2,
  Vector3,
  Raycaster,
} from "three"
import { Scene } from "./Scene"
import { BrickFactory } from "./BrickFactory"
import { Bricks } from "./Bricks"
import gsap from "gsap"
import { mainBuilderColor } from "../js/utils"

export class TutorialScene extends Scene {
  async $mounted() {
    this.makeSceneProps()
    this.makeGround()
    await this.makeBricks()
    this.makeBackgroundAndFog()
    this.makeAmbientLights()
    this.makeDirectionalLights()
    this.makeDragControl()
    this.initialize()
  }
  initialize() {
    this.render = this.render.bind(this)
    this.$ticker.add(this.render)
    gsap.to(this.$camera.position, {
      delay: 1,
      x: 8,
      y: 12,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => {
        this.$camera.lookAt(0, 0, 0)
      },
      onComplete: () => {
        this.$orbitControls.enableZoom = true
        this.$orbitControls.enableRotate = true
      },
    })
  }
  makeSceneProps() {
    this.unit = 1
    this.background = new Color(mainBuilderColor)
  }

  makeGround() {
    const geometry = new PlaneGeometry(320, 320)
    const material = new MeshStandardMaterial({
      color: mainBuilderColor,
    })
    this.ground = new Mesh(geometry, material)
    this.ground.rotateX(Math.PI * -0.5)
    this.ground.receiveShadow = true
    this.add(this.ground)

    const size = 320
    const divisions = 400

    const gridHelper = new GridHelper(
      size,
      divisions,
      mainBuilderColor,
      mainBuilderColor
    )
    gridHelper.receiveShadow = true
    gridHelper.position.y = 0.005
    this.add(gridHelper)
  }
  makeBackgroundAndFog() {
    this.background = new Color(mainBuilderColor)
    const near = 20
    const far = 50
    this.fog = new Fog(mainBuilderColor, near, far)
  }
  async makeBricks() {
    this.bricks = new Bricks()
    await BrickFactory.load()
    const allBricks = [
      BrickFactory.make3001({ x: 1, z: 0, hexColor: "red", scene: this }),
      BrickFactory.make3001({ x: 1, z: 1.2, hexColor: "red", scene: this }),
    ]
    allBricks.forEach((brick) => this.bricks.add(brick))
  }
  makeDirectionalLights() {
    this.directionalLight = new DirectionalLight(0xffffff, 0.5)

    this.directionalLight.position.set(-3, 10, 3)
    this.directionalLight.target.position.set(0, 0, 0)

    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.width = 1024 * 2
    this.directionalLight.shadow.mapSize.height = 1024 * 2

    this.directionalLight.shadow.camera.top = 10
    this.directionalLight.shadow.camera.right = 10
    this.directionalLight.shadow.camera.bottom = -10
    this.directionalLight.shadow.camera.left = -10

    this.directionalLight.shadow.camera.near = 1
    this.directionalLight.shadow.camera.far = 30

    this.add(this.directionalLight)
  }
  makeAmbientLights() {
    this.ambientLight = new AmbientLight(0xffffff, 0.75)
    this.add(this.ambientLight)
  }
  makeDragControl() {
    this.velocity = new Vector2()
    this.velocityAnchor = new Vector2()
    this.cameraDirection = new Vector3()
    this.raycaster = new Raycaster()

    this.intersectedObjects = []
    let brickPosition = new Vector3()
    const cameraLookAtCenter = new Vector3()
    let timer

    this.$pointer.on("start", ({ x, y }) => {
      timer = new Date().getTime()

      this.velocity.set(0, 0)
      this.raycaster.setFromCamera({ x, y }, this.$camera)
      this.intersectedObjects = this.raycaster.intersectObjects(
        this.bricks.meshes()
      )

      if (this.intersectedObjects.length > 0) {
        this.$orbitControls.enabled = false
        const [{ object: mesh } = {}] = this.intersectedObjects

        brickPosition.set(mesh.position.x, mesh.position.y, mesh.position.z)

        this.collidableBricks = this.bricks
          .collection()
          .filter(({ uuid }) => {
            return uuid !== mesh.uuid
          })
          .sort(({ boundingBox: a } = {}, { boundingBox: b } = {}) => {
            return b.min.y - a.min.y
          })
      } else {
        this.collidableBricks = []
      }
    })
    this.$pointer.on("move", ({ x, y, xv, yv }) => {
      const [{ object: mesh } = {}] = this.intersectedObjects

      if (!mesh) return

      const distanceToCameraLookAt =
        this.$camera.position.distanceTo(cameraLookAtCenter)
      this.velocity.set(yv, xv)
      this.$camera.getWorldDirection(this.cameraDirection)
      const theta = Math.atan2(this.cameraDirection.z, this.cameraDirection.x)
      this.velocity.rotateAround(this.velocityAnchor, theta)

      brickPosition.x += this.velocity.x * distanceToCameraLookAt * 0.5
      brickPosition.z += this.velocity.y * distanceToCameraLookAt * 0.5

      const x_ =
        Math.round(brickPosition.x / BrickFactory.unit) * BrickFactory.unit
      const z_ =
        Math.round(brickPosition.z / BrickFactory.unit) * BrickFactory.unit
      mesh.position.x = x_
      mesh.position.z = z_
      mesh.$.updateBoundingBox()
    })

    this.$pointer.on("end", ({ x, y }) => {
      this.$orbitControls.enabled = true

      const [{ object: mesh } = {}] = this.intersectedObjects

      if (!mesh) return

      const newTime = new Date().getTime()
      if (newTime - timer < 200) {
        mesh.rotation.y += Math.PI / 2
        mesh.$.updateBoundingBox()
      }
    })
  }
  updateIntersectedObjects() {
    const [{ object: mesh } = {}] = this.intersectedObjects
    if (!mesh) return

    mesh.$.update()

    const collidedBricks = this.collidableBricks?.filter(
      ({ boundingBox } = {}) => {
        return mesh.$.boundingBox.intersectsBox(boundingBox)
      }
    )
    if (collidedBricks.length) {
      const [brick] = collidedBricks
      const y = brick.boundingBox.max.y
      mesh.position.y = y
      mesh.$.updateBoundingBox()
    } else {
      const intersectionBelowPlaneBrick = mesh.$.getIntersectingPlanes(
        this.collidableBricks,
        ({ minY1, maxY2 }) => Math.abs(minY1 - maxY2) < 0.1
      )

      if (intersectionBelowPlaneBrick.length) {
        mesh.$.setBelow(intersectionBelowPlaneBrick)
      } else if (mesh.$.hasBelow()) {
        const [belowBrick] = mesh.$.below
        mesh.position.y = belowBrick.boundingBox.min.y
        mesh.$.updateBoundingBox()

        const intersectionBelowPlaneBrick = mesh.$.getIntersectingPlanes(
          this.collidableBricks,
          ({ minY1, maxY2 }) => Math.abs(minY1 - maxY2) < 0.1
        )

        if (intersectionBelowPlaneBrick.length) {
          this.updateIntersectedObjects()
        } else {
          mesh.position.y = 0
          mesh.$.updateBoundingBox()
          mesh.$.clearBelow()
        }
      } else {
        mesh.position.y = 0
        mesh.$.updateBoundingBox()
        mesh.$.clearBelow()
      }
    }
  }
  render() {
    this.updateIntersectedObjects()
  }
}
