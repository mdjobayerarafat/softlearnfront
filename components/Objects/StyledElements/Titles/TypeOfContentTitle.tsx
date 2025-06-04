import Image from 'next/image'
import CoursesLogo from 'public/svg/courses.svg'
import CollectionsLogo from 'public/svg/collections.svg'
import TrailLogo from 'public/svg/trail.svg'

function TypeOfContentTitle(props: { title: string; type: string }) {
  function getLogo() {
    if (props.type == 'col') {
      return CollectionsLogo
    } else if (props.type == 'cou') {
      return CoursesLogo
    } else if (props.type == 'tra') {
      return TrailLogo
    }
  }

  function getGradientClass() {
    if (props.type == 'col') {
      return 'from-emerald-400 to-blue-400'
    } else if (props.type == 'cou') {
      return 'from-blue-400 to-purple-400'
    } else if (props.type == 'tra') {
      return 'from-purple-400 to-pink-400'
    }
    return 'from-blue-400 to-purple-400'
  }

  return (
    <div className="home_category_title flex my-5 items-center group">
      <div className="ml-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 shadow-lg p-3 my-auto mr-4 group-hover:scale-110 transition-all duration-300 group-hover:shadow-blue-500/25">
        <Image 
          unoptimized 
          className="w-6 h-6 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
          src={getLogo()} 
          alt="Content type logo" 
        />
      </div>
      <h1 className={`font-bold text-3xl bg-gradient-to-r ${getGradientClass()} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 drop-shadow-sm`}>
        {props.title}
      </h1>
    </div>
  )
}

export default TypeOfContentTitle
