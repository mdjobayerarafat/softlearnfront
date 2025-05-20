import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useOrg } from '../Contexts/OrgContext'

function Watermark() {
    const org = useOrg() as any

    useEffect(() => {
    }, [org]);

    if (org?.config?.config?.general?.watermark) {
        return (
            <div className='fixed bottom-8 right-8'>
                <Link href={`https://www.linkedin.com/in/md-jobayer-arafat-a14b61284/`} className="flex items-center cursor-pointer bg-white/80 backdrop-blur-lg text-gray-700 rounded-2xl p-2 light-shadow text-xs px-5 font-semibold space-x-2">
                    <p>Made by Jobayer</p>
                </Link>
            </div>
        )
    }
    return null
}

export default Watermark