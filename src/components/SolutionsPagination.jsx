function SolutionsPagination({
  currentPage,
  changeCurrentPage,
  numberOfPages,
}) {
  return (
    <>
      {numberOfPages > 1 && (
        <div className="z-20 relative mb-16 mx-auto w-[calc(100%-40px)] md:max-w-lg overflow-auto">
          <div
            className="flex gap-1 text-sm md:text-md font-medium pb-4 justify-center"
            // :class="numberOfPages < 11 ? 'justify-center' : ''"
          >
            {[...Array(numberOfPages)].map((_, page) => (
              <button
                key={page + 1}
                className={`h-7 min-w-[35px] md:h-8 md:min-w-[40px] rounded-full ${
                  Number(currentPage === page + 1)
                    ? "bg-yellow text-black"
                    : " bg-purple-dark text-white"
                }`}
                onClick={() => changeCurrentPage(page + 1)}
              >
                {page + 1}
              </button>
            ))}
            {/* <button
        v-for="page in numberOfPages"
        :key="page"
        class="h-7 min-w-[35px] md:h-8 md:min-w-[40px] rounded-full"
        :class="[
          Number(currentPage) === page
            ? 'bg-yellow text-black'
            : ' bg-purple-light text-white',
        ]"
        @click="changeCurrentPage(page)"
      >
        {{ page }}
      </button> */}
          </div>
        </div>
      )}
    </>
  )
}

export default SolutionsPagination
