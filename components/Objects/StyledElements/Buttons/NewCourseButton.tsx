'use client'

function NewCourseButton() {
  return (
    <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 ease-out antialiased p-2 px-5 my-auto font text-xs font-bold text-white drop-shadow-lg flex space-x-2 items-center border border-blue-500/20 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm">
      <div>New Course </div>
      <div className="text-md bg-slate-800/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-slate-700/30">+</div>
    </button>
  )
}

export default NewCourseButton
