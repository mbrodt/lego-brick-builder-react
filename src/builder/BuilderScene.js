import {
  Color,
  Fog,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  GridHelper,
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
import {
  map,
  mapConstrain,
  mainBuilderColor,
  playClickSound,
} from "../js/utils"
import updateIntersectedObjects from "../js/UpdateIntersectedObjects"
import useBricksStore from "@/store/bricks"

export class BuilderScene extends Scene {
  async $mounted() {
    this.makeSceneProps()
    this.makeGround()
    this.makeFog()
    await this.makeBricks()
    this.makeAmbientLights()
    this.makeDirectionalLights()
    this.makeDragControl()
    this.initialize()
  }
  initialize() {
    this.render = this.render.bind(this)
    this.$ticker.add(this.render)
    gsap.to(this.$camera.position, {
      delay: 2,
      x: 10,
      y: 25,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => {
        this.$camera.lookAt(0, 0, 0)
      },
      onComplete: () => {
        this.$orbitControls.enableZoom = true
        this.$orbitControls.enableRotate = true
      },
    })
    // Use this and disable the gsap animation above for easier dev workflow
    // this.$camera.position.set(10, 25)
    // this.$camera.lookAt(0, 0, 0)
    // this.$orbitControls.enableZoom = true
    // this.$orbitControls.enableRotate = true
  }
  makeSceneProps() {
    this.unit = 1
    this.background = new Color(mainBuilderColor)
  }
  makeFog() {
    const near = 30
    const far = 80
    this.fog = new Fog(mainBuilderColor, near, far)
  }
  makeGround() {
    const geometry = new PlaneGeometry(320, 320)
    const material = new MeshStandardMaterial({ color: mainBuilderColor })
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

  async makeBricks() {
    this.bricks = new Bricks()
    await BrickFactory.load()

    const emeraldDuckBricks = [
      {
        element_id: 3003,
        color: "#58AB41", // Bright Green
        texture: null,
        amount: 1,
      },
      {
        element_id: 3004,
        color: "#58AB41", // Bright Green
        texture: null,
        amount: 1,
      },
      {
        element_id: 3002,
        color: "#00852B", // Dark Green
        texture: null,
        amount: 1,
      },
      {
        element_id: 3003,
        color: "#00852B", // Dark Green
        texture: null,
        amount: 1,
      },
      {
        element_id: 3021,
        color: "#00451A", // Earth Green
        texture: null,
        amount: 2,
      },
    ]

    // Default to different bricks with textures if there's no exericse (just for testing)
    const exerciseBricks = emeraldDuckBricks
    console.log("exerciseBricks:", exerciseBricks)

    // We define some positions for the bricks spawn points. The first ones will be about where the camera is focused on, with the rest expanding in each direction if there are a lot of bricks in the exercise
    const startingPositions = [
      { x: -1, z: -0.2 },
      { x: -1, z: 1.4 },
      { x: 0, z: -0.2 },
      { x: 0, z: 1.4 },
      { x: 1, z: -0.2 },
      { x: 1, z: 1.4 },
      { x: 2, z: -0.2 },
      { x: 2, z: 1.4 },
      { x: 3, z: -0.2 },
      { x: 3, z: 1.4 },
      { x: 4, z: -0.2 },
      { x: 4, z: 1.4 },
      { x: 5, z: -0.2 },
      { x: 5, z: 1.4 },
      { x: 6, z: -0.2 },
      { x: 6, z: 1.4 },
      { x: -2, z: -0.2 },
      { x: -2, z: 1.4 },
      { x: -3, z: -0.2 },
      { x: -3, z: 1.4 },
      { x: -4, z: -0.2 },
      { x: -4, z: 1.4 },
      { x: -5, z: -0.2 },
      { x: -5, z: 1.4 },
      { x: -6, z: -0.2 },
      { x: -6, z: 1.4 },
      { x: -7, z: -0.2 },
      { x: -7, z: 1.4 },
      { x: -8, z: -0.2 },
      { x: -8, z: 1.4 },
      { x: 7, z: -0.2 },
      { x: 7, z: 1.4 },
      { x: 8, z: -0.2 },
      { x: 8, z: 1.4 },
    ]

    let brickIndex = 0

    const allBricks = exerciseBricks.reduce((acc, exerciseBrick, index) => {
      const { amount, element_id, color, texture } = exerciseBrick
      for (let i = 0; i < amount; i++) {
        const { x, z } = startingPositions[brickIndex] || { x: 0, z: 0 }
        const functionName = `make${element_id}`
        const singleBrick = BrickFactory[functionName]({
          x,
          z,
          hexColor: color,
          texture,
          scene: this,
        })
        acc.push(singleBrick)
        brickIndex += 1
      }
      return acc
    }, [])

    allBricks.forEach((brick) => {
      this.bricks.add(brick)
    })

    this.saveBrickPositions({ initial: true })
  }
  makeDirectionalLights() {
    this.mainDirectionalLight = new DirectionalLight(0xffffff, 0.3)

    this.mainDirectionalLight.position.set(-10, 25, -10)
    this.mainDirectionalLight.target.position.set(0, 0, 0)

    this.mainDirectionalLight.castShadow = true
    this.mainDirectionalLight.shadow.mapSize.width = 1024 * 2
    this.mainDirectionalLight.shadow.mapSize.height = 1024 * 2

    this.mainDirectionalLight.shadow.camera.top = 50
    this.mainDirectionalLight.shadow.camera.right = 50
    this.mainDirectionalLight.shadow.camera.bottom = -50
    this.mainDirectionalLight.shadow.camera.left = -50

    this.mainDirectionalLight.shadow.camera.near = 1
    this.mainDirectionalLight.shadow.camera.far = 40

    // We use two different lights to get different colors on each side of a brick
    this.secondaryDirectionalLight = this.mainDirectionalLight.clone()
    this.secondaryDirectionalLight.position.set(5, 25, -10)
    this.secondaryDirectionalLight.castShadow = false

    this.add(this.mainDirectionalLight)
    this.add(this.secondaryDirectionalLight)
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
    this.isDragging = false
    this.intersectedObjects = []
    this.aboveBricks = []
    this.brickPosition = new Vector3()
    const cameraLookAtCenter = new Vector3()
    let timer

    this.$pointer.on("start", ({ x, y }) => {
      this.isDragging = true
      timer = new Date().getTime()

      this.velocity.set(0, 0)
      this.raycaster.setFromCamera({ x, y }, this.$camera)
      this.intersectedObjects = this.raycaster.intersectObjects(
        this.bricks.meshes()
      )

      if (this.intersectedObjects.length > 0) {
        this.$orbitControls.enabled = false
        const [{ object: mesh } = {}] = this.intersectedObjects

        this.aboveBricks = this.bricks.getAboveBricks(mesh.$)

        this.aboveBricks.forEach((brick) => {
          brick.hovering()
        })
        mesh.$.hovering()

        this.brickPosition.set(
          mesh.position.x,
          mesh.position.y,
          mesh.position.z
        )

        this.collidableBricks = this.bricks
          .collection()
          .filter(
            ({ uuid }) => !this.aboveBricks.find((item) => item.uuid === uuid)
          )
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

      if (mesh.$.hasBelow()) {
        mesh.$.gluing()
      } else {
        mesh.$.hovering()
      }

      const distanceToCameraLookAt =
        this.$camera.position.distanceTo(cameraLookAtCenter)

      const aWorldToLocalMap =
        mapConstrain(y, 0, 1, 2, map(this.$camera.rotation.y, 0, 1.5, 1, 5)) *
        0.25
      const { offsetWidth, offsetHeight } = this.$renderer.domElement
      const bWorldToLocalMap = mapConstrain(
        offsetWidth / offsetHeight,
        0.5,
        1.5,
        0.25,
        0.75
      )
      const _a = yv * distanceToCameraLookAt * aWorldToLocalMap
      const _b = xv * distanceToCameraLookAt * bWorldToLocalMap

      // Map Camera Rotation
      this.velocity.set(_a, _b)
      this.$camera.getWorldDirection(this.cameraDirection)
      const theta = Math.atan2(this.cameraDirection.z, this.cameraDirection.x)
      this.velocity.rotateAround(this.velocityAnchor, theta)

      this.brickPosition.x += this.velocity.x
      this.brickPosition.z += this.velocity.y
    })
    this.$pointer.on("end", ({ x, y }) => {
      this.isDragging = false
      this.$orbitControls.enabled = true

      const [{ object: mesh } = {}] = this.intersectedObjects

      if (!mesh) return

      mesh.$.stationary()

      if (mesh.$.hasBelow()) {
        playClickSound()
      }

      this.aboveBricks.forEach((brick) => {
        brick.stationary()
      })

      if (!this.bricks.brickNotRotateable(mesh.$)) {
        const newTime = new Date().getTime()
        const duration = newTime - timer

        if (duration < 200 && duration > 50) {
          const rotate = Math.PI / 2
          mesh.rotation.y =
            parseInt((mesh.rotation.y + rotate + 0.01) / rotate) * rotate
          mesh.$.updateBoundingBox()
        }
      }

      this.saveBrickPositions()
    })
  }

  saveBrickPositions({ initial } = {}) {
    useBricksStore.setState({ bricks: this.bricks.data() })
    if (!initial) {
      useBricksStore.setState({ moves: useBricksStore.getState().moves + 1 })
    }
  }

  render() {
    this.bricks.bricks.forEach((brick) => brick.update())

    const [{ object: mesh } = {}] = this.intersectedObjects

    if (!mesh) return

    updateIntersectedObjects(mesh, {
      brickPosition: this.brickPosition,
      collidableBricks: this.collidableBricks,
      aboveBricks: this.aboveBricks,
      allBricks: this.bricks.bricks,
    })

    const allCollidingBricks = [
      ...new Set(
        this.collidableBricks?.reduce((acc, brick) => {
          const colliding = this.aboveBricks.filter(({ boundingBox: b }) => {
            return b.intersectsBox(brick.boundingBox)
          })
          if (colliding.length) {
            acc.push(...colliding, brick)
          }
          return acc
        }, [])
      ),
    ]

    allCollidingBricks.forEach((collidingBrick, index) => {
      collidingBrick.showCollisionFrame()
    })

    if (allCollidingBricks.length === 0) {
      this.collidableBricks.forEach((collidingBrick) => {
        collidingBrick.resetColor()
      })
      this.aboveBricks.forEach((aBrick) => {
        if (aBrick.isHovering) {
          aBrick.highlightColor()
        } else {
          aBrick.resetColor()
        }
      })
    }

    // If we are not dragging, we need to check if any of the aboveBricks collide with anything else
    if (!this.isDragging) {
      const collidingBrickWithAboveBricks = this.collidableBricks?.filter(
        ({ boundingBox } = {}) => {
          return this.aboveBricks.some(({ boundingBox: b }) => {
            return b.intersectsBox(boundingBox)
          })
        }
      )
      // If any of the aboveBricks are colliding, we calculate the direction the stack is moving from and move it back in that direction
      const [brick] = collidingBrickWithAboveBricks
      if (brick) {
        const direction = new Vector3()
        direction.subVectors(mesh.position, brick.mesh.position)
        direction.x = Math.sign(direction.x) * BrickFactory.unit
        direction.z = Math.sign(direction.z) * BrickFactory.unit

        this.brickPosition.x +=
          Math.round(direction.x / BrickFactory.unit) * BrickFactory.unit
        this.brickPosition.z +=
          Math.round(direction.z / BrickFactory.unit) * BrickFactory.unit
      }
    }
  }
}
