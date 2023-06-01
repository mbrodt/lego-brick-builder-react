import {
  Color,
  Fog,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  GridHelper,
  DirectionalLight,
  AmbientLight,
} from "three"

import { Scene } from "./Scene"
import { mainBuilderColor } from "../js/utils"
export class SolutionScene extends Scene {
  async $mounted() {
    this.makeSceneProps()
    this.makeGround()
    this.makeFog()
    this.makeAmbientLights()
    this.makeDirectionalLights()
  }
  makeSceneProps() {
    this.unit = 1
    // this.background = new Color(mainBuilderColor)
  }
  makeFog() {
    const near = 30
    const far = 50
    this.fog = new Fog(mainBuilderColor, near, far)
  }
  makeGround() {
    const geometry = new PlaneGeometry(320, 320)
    const material = new MeshStandardMaterial({ color: mainBuilderColor })
    this.ground = new Mesh(geometry, material)
    this.ground.rotateX(Math.PI * -0.5)
    // this.ground.receiveShadow = true
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
}
