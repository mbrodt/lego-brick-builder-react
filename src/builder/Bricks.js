export class Bricks {
  constructor() {
    this.bricks = []
  }
  add(item) {
    if (this.bricks.indexOf(item) === -1) {
      this.bricks.push(item)
    }
  }
  remove(item) {
    this.bricks = this.brick.filter((a) => a != item)
  }
  collection() {
    return this.bricks
  }
  meshes() {
    return this.bricks.map(({ mesh }) => mesh)
  }
  data() {
    return this.bricks.map((brick) => brick.data())
  }
  testableData() {
    return this.bricks.map((brick) => brick.testableData())
  }
  brickNotRotateable(brick) {
    return this.bricks.some(({ below }) => below.find((item) => item === brick))
  }
  getAboveBricks(brick, returnable = []) {
    const aboveBricks = this.bricks.filter(({ below }) =>
      below.find((item) => item.uuid === brick.uuid)
    )
    returnable = [...returnable, ...aboveBricks]
    if (aboveBricks.length) {
      return [
        ...new Set(
          aboveBricks
            .map((item) => this.getAboveBricks(item, returnable))
            .flat()
        ),
      ]
    }
    return returnable
  }
}
