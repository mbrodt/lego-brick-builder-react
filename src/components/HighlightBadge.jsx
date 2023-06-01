function HighlightBadge({ position, value }) {
  return (
    <div className="bg-pink text-black rounded-full absolute left-2 top-2 font-black px-8 py-2">
      {position} - {value}
    </div>
  )
}

export default HighlightBadge
