import { PerspectiveCamera, CameraHelper } from "three"
export class CameraFactory {
  static makePerspectiveCamera({
    fov = 50,
    x = 0.01,
    y = 15,
    z = 0,
    near = 0.1,
    far = 1000,
    debug = false,
    scene = null,
    aspectRatio = window.innerWidth / window.innerHeight,
  } = {}) {
    const camera = new PerspectiveCamera(fov, aspectRatio, near, far)
    camera.position.set(x, y, z)
    if (debug) {
      const cameraHelper = new CameraHelper(camera)
      scene.add(cameraHelper)
    }
    return camera
  }
}
