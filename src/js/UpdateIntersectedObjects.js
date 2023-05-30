import { BrickFactory } from "../builder/BrickFactory"

export default function updateIntersectedObjects(
  mesh,
  { brickPosition, collidableBricks = [], aboveBricks = [] } = {}
) {
  if (!mesh) return

  // Round the X and Z position of "mesh" to the nearest multiple of the unit size
  const x_ = Math.round(brickPosition.x / BrickFactory.unit) * BrickFactory.unit
  const z_ = Math.round(brickPosition.z / BrickFactory.unit) * BrickFactory.unit

  // Store the "original" X, Y and Z position of "mesh"
  const originalX = x_
  const originalY = mesh?.position?.y
  const originalZ = z_

  // Filter the collidable bricks to only include those that intersect with "mesh"
  const collidedBricks = collidableBricks?.filter(({ boundingBox } = {}) => {
    return mesh.$.boundingBox.intersectsBox(boundingBox)
  })

  // If there are any collided bricks, move "mesh" to sit on top of the highest one
  if (collidedBricks.length) {
    const [brick] = collidedBricks

    // Get the maximum Y value of the bounding box of the collided brick
    const y = brick?.boundingBox?.max?.y

    // Add a tiny offset to make a small gap between bricks and update the bounding box of "mesh"
    mesh.position.y = y + 0.01
    mesh.$.updateBoundingBox()
  } else {
    // Find any intersecting planes below "mesh" that are less than 0.1 units apart in Y
    const intersectionBelowPlaneBrick = mesh.$.getIntersectingPlanes(
      collidableBricks,
      ({ minY1, maxY2 }) => Math.abs(minY1 - maxY2) < 0.1
    )

    // If "mesh" sit on top of some of the collidedbrickes, add that brick to its "below" property
    if (intersectionBelowPlaneBrick.length) {
      mesh.$.setBelow(intersectionBelowPlaneBrick)

      // If "mesh" is not sitting on top of any of the collided bricks
    } else {
      // Calculate the height of "mesh"
      const height = mesh.$.boundingBox.max.y - mesh.$.boundingBox.min.y

      // Move "mesh" down by half its height and update it's boundingBox
      mesh.position.y -= height * 0.5
      mesh.$.updateBoundingBox()

      // Filter the collidable bricks to only include those that intersect with "mesh"
      const collidingBricks = collidableBricks?.filter(
        ({ boundingBox } = {}) => {
          return mesh.$.boundingBox.intersectsBox(boundingBox)
        }
      )

      // If "mesh" is not intersecting with any of the collided bricks, move it back to its original Y position
      if (!collidingBricks.length) {
        const [belowBrick] = mesh.$.below
        mesh.position.y = Math.max(0, belowBrick?.boundingBox?.min?.y || 0)
        mesh.$.updateBoundingBox()
        mesh.$.clearBelow()
      }
    }
  }

  const movedOffsetX = originalX - mesh?.position?.x
  const movedOffsetY = mesh?.position?.y - originalY
  const movedOffsetZ = originalZ - mesh?.position?.z

  mesh.position.x = originalX
  mesh.position.z = originalZ
  mesh.$.updateBoundingBox()

  aboveBricks.forEach((aboveBrick) => {
    aboveBrick.mesh.position.x += movedOffsetX
    aboveBrick.mesh.position.y += movedOffsetY
    aboveBrick.mesh.position.z += movedOffsetZ
    aboveBrick.updateBoundingBox()
  })
}
