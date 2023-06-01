import { WebGLRenderer, PCFSoftShadowMap, Vector3 } from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BrickFactory } from "../builder/BrickFactory"
import { SolutionScene } from "../builder/SolutionScene"
import { CameraFactory } from "../builder/CameraFactory"

const MAX_PIXEL_RATIO = 1.5

export class MultipleSceneRenderer {
  constructor({ canvas, solutions, solutionCanvasses } = {}) {
    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      powerPreference: "high-performance",
    })

    //remove flickering when changing current page with pagination
    renderer.setClearColor("#000000", 0)

    renderer.setPixelRatio(Math.max(window.devicePixelRatio, MAX_PIXEL_RATIO))

    this.canvas = canvas
    this.renderer = renderer
    this.allControls = []

    this.setupScenes(solutions, solutionCanvasses).then((scenes) => {
      this.scenes = scenes

      this.render = this.render.bind(this)
      requestAnimationFrame(this.render)
    })
  }

  async setupScenes(solutions, solutionCanvasses) {
    await BrickFactory.load()
    BrickFactory.loadExisting = true

    return solutions.map((solution, index) => {
      const domNode = solutionCanvasses[index]
      return this.createBuildScene(domNode, solution)
    })
  }

  createBuildScene(domNode, solution) {
    const sceneInfo = this.makeScene(domNode, solution.bricks)

    solution.bricks.forEach((brick) => {
      const functionName = `make${brick.id}`
      const { x, y, z } = brick.position

      const createdBrick = BrickFactory[functionName]({
        x,
        y,
        z,
        hexColor: brick.color,
        texture: brick.texture,
        scene: sceneInfo.scene,
      })

      const { _x, _y, _z } = brick.rotation

      // Handle rotations
      createdBrick.mesh.rotation.set(_x, _y, _z)
      createdBrick.graphic.rotation.set(_x, _y, _z)
    })

    return sceneInfo
  }

  getPointsCenterP(points) {
    let minX = Infinity
    let maxX = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity

    points.forEach(({ x, z }) => {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minZ = Math.min(minZ, z)
      maxZ = Math.max(maxZ, z)
    })
    return { x: (minX + maxX) / 2, z: (minZ + maxZ) / 2 }
  }

  makeScene(elem, bricks) {
    const scene = new SolutionScene()
    const camera = CameraFactory.makePerspectiveCamera({ x: 10, y: 10, z: 0 })
    const controls = this.makeOrbitControls({ camera, elem })

    const { x, z } = this.getPointsCenterP(
      bricks.map((brick) => brick.position)
    )
    // Look at the center of the build
    controls.target = new Vector3(x, 0, z)
    this.allControls.push(controls)

    return { scene, camera, elem }
  }

  makeOrbitControls({ camera, elem }) {
    const controls = new OrbitControls(camera, elem)

    // Restrict zoom and panning options (when panning is enabled on highlighted build)
    controls.maxPolarAngle = Math.PI / 2 - 0.1
    controls.screenSpacePanning = false
    controls.minDistance = 5
    controls.maxDistance = 30
    controls.enablePan = false
    controls.enableZoom = true
    controls.enableRotate = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    return controls
  }

  enableControls() {
    this.allControls.forEach((controls) => {
      // controls.enablePan = true
      controls.enableZoom = true
      controls.enableRotate = true
    })
  }

  disableControls() {
    this.allControls.forEach((controls) => {
      // controls.enablePan = false
      controls.enableZoom = false
      controls.enableRotate = false
    })
  }
  resetCamera() {
    this.scenes.forEach((sceneInfo) => {
      const { camera } = sceneInfo
      gsap.to(camera.position, {
        delay: 0.5,
        duration: 1.5,
        ease: "power3.inOut",
        y: 10,
      })
    })
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      this.renderer.setSize(width, height, false)
    }
    return needResize
  }

  renderSceneInfo(sceneInfo) {
    const { scene, camera, elem } = sceneInfo

    // get the viewport relative position of this element
    const { left, right, top, bottom, width, height } =
      elem.getBoundingClientRect()

    const isOffscreen =
      bottom < 0 ||
      top > this.renderer.domElement.clientHeight ||
      right < 0 ||
      left > this.renderer.domElement.clientWidth

    if (isOffscreen) {
      return
    }

    camera.aspect = width / height

    camera.updateProjectionMatrix()

    const positiveYUpBottom = this.renderer.domElement.clientHeight - bottom
    this.renderer.setScissor(left, positiveYUpBottom, width, height)
    this.renderer.setViewport(left, positiveYUpBottom, width, height)

    this.renderer.render(scene, camera)
  }

  render() {
    this.resizeRendererToDisplaySize()
    this.renderer.setScissorTest(false)
    this.renderer.clear(true, true)
    this.renderer.setScissorTest(true)

    this.allControls.forEach((controls) => {
      controls.update()
    })
    this.scenes.forEach((sceneInfo) => {
      this.renderSceneInfo(sceneInfo)
    })
    requestAnimationFrame(this.render)
  }
}
