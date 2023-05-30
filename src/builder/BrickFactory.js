// import * as THREE from "three"
import {
  Color,
  MeshPhongMaterial,
  MeshBasicMaterial,
  BoxGeometry,
  Mesh,
  RepeatWrapping,
} from "three"
import { Brick } from "./Brick"

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { TextureLoader } from "three/src/loaders/TextureLoader.js"

export class BrickFactory {
  static loadExisting = false
  static unit = 0.8
  static unitHeight = 0.96

  static fbxLoader = new FBXLoader()
  static textureLoader = new TextureLoader()
  static catalog = {}
  constructor() {}
  static async load() {
    return Promise.all([
      this.loader({ file: "/3001-2x4.fbx", id: 3001 }),
      this.loader({
        file: "/3002-2x3.fbx",
        id: 3002,
      }),
      this.loader({
        file: "/3003-2x2.fbx",
        id: 3003,
      }),
      this.loader({
        file: "/3004-2x1.fbx",
        id: 3004,
      }),
      this.loader({
        file: "/3005-1x1.fbx",
        id: 3005,
      }),
      this.loader({
        file: "/3009-1x6.fbx",
        id: 3009,
      }),
      this.loader({
        file: "/3010-1x4.fbx",
        id: 3010,
      }),
      this.loader({
        file: "/3021-2x3-flat.fbx",
        id: 3021,
      }),
      this.loader({
        file: "/3032-4x6-flat.fbx",
        id: 3032,
      }),
      this.loader({
        file: "/3622-1x3.fbx",
        id: 3622,
      }),
      this.loader({
        file: "/3710-1x4-flat.fbx",
        id: 3710,
      }),
      this.loader({
        file: "/3795-2x6-flat.fbx",
        id: 3795,
      }),
      this.loader({
        file: "/4589-1x1-cone.fbx",
        id: 4589,
      }),
    ])
  }
  static async loader({ file, name, id } = {}) {
    return new Promise((resolve) => {
      this.fbxLoader.load(file, (obj) => {
        this.catalog = {
          ...this.catalog,
          [id]: obj,
        }
        resolve()
      })
    })
  }

  static setDefaultPosition({ modelGroup, brickMesh }) {
    modelGroup.position.x = brickMesh.position.x
    modelGroup.position.y = brickMesh.position.y
    modelGroup.position.z = brickMesh.position.z
    modelGroup.rotation.y = brickMesh.rotation.y
  }

  static updateBrickPosition({ brickMesh, x, y, z, scene }) {
    // If we're creating the bricks for the first time, we adjust their position to align with the grid
    if (!this.loadExisting) {
      brickMesh.position.x += x * this.unit * 3 - this.unit * 3
      brickMesh.position.z += z * this.unit * 5 - this.unit * 3
    } else {
      // If we're loading pre-existing bricks, just set their positions directly
      brickMesh.position.x = x
      brickMesh.position.y = y
      brickMesh.position.z = z
    }
    brickMesh.rotation.y = Math.PI * 0.5

    brickMesh.visible = false

    scene.add(brickMesh)
  }

  static createColorMaterial({ texture, hexColor } = {}) {
    const color = new Color(hexColor)
    if (!hexColor) {
      color.setHex(Math.random() * 0xffffff)
    }

    const mainMaterial = new MeshPhongMaterial({ color })

    // If the brick has a texture, add that as a second material and make it transparent so the mainMaterial colors show through
    let textureMaterial = null
    if (texture) {
      const loadedTexture = this.textureLoader.load(texture)
      if (loadedTexture) {
        loadedTexture.wrapT = RepeatWrapping
        textureMaterial = new MeshBasicMaterial({
          map: loadedTexture,
          transparent: true,
        })
      }
    }

    return {
      color,
      material: [mainMaterial, textureMaterial],
    }
  }

  static updateChildren({
    modelGroup,
    material,
    rotate = false,
    y,
    xSize = 0.5,
    zSize = 0.5,
  }) {
    modelGroup.children
      .filter((obj) => obj.type === "Mesh")
      .forEach((item) => {
        item.position.x = this.unit * xSize
        item.position.z = this.unit * zSize

        // Allows the bricks to use textures
        item.geometry.clearGroups()
        item.geometry.addGroup(0, Infinity, 0)
        item.geometry.addGroup(0, Infinity, 1)

        item.material = material
        item.needsUpdate = true
        item.castShadow = true
        // For some reason this causes issues when loading pre-existing bricks, so we only do it when creating new bricks
        if (y && !this.loadExisting) item.position.y = y
        if (rotate) item.rotation.y = Math.PI * 0.5
      })
  }

  static make3005({ x, y, z, hexColor, scene, texture }) {
    return this.make({
      id: 3005,
      type: "1by1",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 1,
      width: 1,
      offset: { x: 0.5, z: 0.5 },
    })
  }
  static make3009({ x, y, z, hexColor, scene, texture }) {
    return this.make({
      id: 3009,
      type: "1by6",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 1,
      width: 6,
      xSize: -2.5,
      // zSize: 0,
      offset: { x: 0, z: 0.5 },
    })
  }
  static make3010({ x, y, z, hexColor, scene, texture }) {
    return this.make({
      id: 3010,
      type: "1by4",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 1,
      width: 4,
      xSize: 1.5,
      offset: {
        x: 0,
        z: 0.5,
      },
    })
  }
  static make4589({ x, y, z, hexColor, scene, texture }) {
    return this.make({
      id: 4589,
      type: "1by1cone",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 1,
      width: 1,
      offset: { x: 0.5, z: 0.5 },
    })
  }
  static make3004({ x, y, z, hexColor, scene, texture }) {
    return this.make({
      id: 3004,
      type: "2by1",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 2,
      width: 1,
      rotate: true,
      offset: { x: 0.5 },
    })
  }
  static make3003({ x, y, z, hexColor, scene, texture }) {
    return this.make({
      id: 3003,
      type: "2by2",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 2,
      width: 2,
      rotate: true,
    })
  }

  static make3002({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3002,
      type: "2by3",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 2,
      width: 3,
      xSize: -0.5,
      offset: { x: 0.5 },
    })
  }
  static make3001({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3001,
      type: "2by4",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 2,
      width: 4,
      xSize: -1.5,
    })
  }

  static make3021({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3021,
      type: "2by3flat",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 2,
      width: 3,
      height: 0.33,
      xSize: -0.5,
      offset: { x: 0.5 },
    })
  }
  static make3032({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3032,
      type: "4by6flat",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 4,
      width: 6,
      height: 0.33,
      xSize: -2.5,
      zSize: 1.5,
    })
  }
  static make3622({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3622,
      type: "1by3",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 1,
      width: 3,
      xSize: -0.5,
      offset: { x: 0.5, z: 0.5 },
    })
  }
  static make3710({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3710,
      type: "1by4flat",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 1,
      width: 4,
      height: 0.33,
      xSize: -1.5,
      zSize: 0.5,
      offset: { z: 0.5 },
    })
  }
  static make3795({ x, y, z, hexColor, scene, texture } = {}) {
    return this.make({
      id: 3795,
      type: "2by6flat",
      x,
      y,
      z,
      hexColor,
      scene,
      texture,
      depth: 2,
      width: 6,
      height: 0.33,
      xSize: -2.5,
    })
  }

  static make({
    id,
    x,
    y,
    z,
    hexColor,
    scene,
    texture,
    depth,
    width,
    height,
    offset,
    xSize,
    zSize,
    rotate,
  } = {}) {
    const brickMesh = this.makeSimpleCollidableBrick({
      depth,
      width,
      height,
      offset,
    })

    const completionColliderMesh = this.makeSimpleCollidableBrick({
      depth,
      width,
      height,
      offset,
      scaleHeight: true,
      unit: 1.05,
    })
    this.updateBrickPosition({ brickMesh, x, y, z, scene })
    this.updateBrickPosition({
      brickMesh: completionColliderMesh,
      x,
      y,
      z,
      scene,
    })

    const { color, material } = this.createColorMaterial({
      texture,
      hexColor,
    })

    const modelGroup = this.catalog[id].clone()

    // Only needed if the modelGroup contains other objects like lights or cameras
    modelGroup.children = modelGroup.children.filter(
      (child) => child.type === "Mesh"
    )

    this.updateChildren({
      modelGroup,
      material,
      y,
      xSize,
      zSize,
      rotate,
    })

    this.setDefaultPosition({ modelGroup, brickMesh })
    this.setDefaultPosition({ modelGroup, brickMesh: completionColliderMesh })

    scene.add(modelGroup)

    const brick = new Brick({
      mesh: brickMesh,
      graphic: modelGroup,
      completionColliderMesh: completionColliderMesh,
      texture,
      defaultColor: color,
      id,
      scene,
    })

    return brick
  }

  static makeSimpleCollidableBrick({
    width = 1,
    depth = 1,
    height = 1,
    unit = 0.9999,
    scaleHeight = false,
    offset: { x = 0, y = 0, z = 0 } = {},
  } = {}) {
    const material = new MeshBasicMaterial()
    const geometryHeight = scaleHeight
      ? this.unitHeight * (height * unit)
      : this.unitHeight * height
    const geometry = new BoxGeometry(
      this.unit * (width * unit),
      geometryHeight,
      this.unit * (depth * unit)
    )
    geometry.translate(
      x * this.unit,
      this.unitHeight * height * 0.5 + y * this.unit,
      z * this.unit
    )
    const mesh = new Mesh(geometry, material)

    return mesh
  }
}
