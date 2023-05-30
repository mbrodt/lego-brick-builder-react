export default function findAboveBricks(brick, bricks, returnable = []) {
  const aboveBricks = bricks.filter(({ below }) =>
    below.find((item) => item.uuid === brick.uuid)
  )
  returnable = [...returnable, ...aboveBricks]
  if (aboveBricks.length) {
    return [
      ...new Set(
        aboveBricks
          .map((item) => findAboveBricks(item, bricks, returnable))
          .flat()
      ),
    ]
  }
  return returnable
}
