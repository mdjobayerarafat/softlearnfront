'use client'
import { useOrg } from '@components/Contexts/OrgContext'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import ConfirmationModal from '@components/Objects/StyledElements/ConfirmationModal/ConfirmationModal'
import { getUriWithOrg } from '@services/config/config'
import { deleteCollection } from '@services/courses/collections'
import { getCourseThumbnailMediaDirectory } from '@services/media/media'
import { revalidateTags } from '@services/utils/ts/requests'
import { X } from 'lucide-react'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

type PropsType = {
  collection: any
  orgslug: string
  org_id: string
}

const removeCollectionPrefix = (collectionid: string) => {
  return collectionid.replace('collection_', '')
}

function CollectionThumbnail(props: PropsType) {
  const org = useOrg() as any
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/20 bg-gradient-to-br from-emerald-600/90 to-blue-600/90 backdrop-blur-sm border border-emerald-500/20">
      <div className="flex h-full w-full items-center justify-between p-4 relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-500" />
        
        <div className="flex items-center space-x-5 relative z-10">
          <div className="flex -space-x-3">
            {props.collection.courses.slice(0, 3).map((course: any, index: number) => (
              <div
                key={course.course_uuid}
                className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/20 shadow-md transition-all duration-300 hover:z-10 hover:scale-110 hover:border-white/40 hover:shadow-lg"
                style={{
                  backgroundImage: `url(${getCourseThumbnailMediaDirectory(
                    org?.org_uuid,
                    course.course_uuid,
                    course.thumbnail_image
                  )})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 3 - index,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 group-hover:opacity-0 transition-opacity duration-300" />
              </div>
            ))}
            {props.collection.courses.length > 3 && (
              <div className="relative h-12 w-12 rounded-full border-2 border-white/20 bg-slate-800/60 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:border-white/40">
                <span className="text-xs font-medium text-white">
                  +{props.collection.courses.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <Link
              href={getUriWithOrg(
                props.orgslug,
                '/collection/' + removeCollectionPrefix(props.collection.collection_uuid)
              )}
              className="text-2xl font-bold text-white hover:text-emerald-100 transition-colors duration-300 drop-shadow-sm"
            >
              {props.collection.name}
            </Link>
            <span className="mt-1 text-sm font-medium text-emerald-100/80 drop-shadow-sm">
              {props.collection.courses.length} course{props.collection.courses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <CollectionAdminEditsArea
          orgslug={props.orgslug}
          org_id={props.org_id}
          collection_uuid={props.collection.collection_uuid}
          collection={props.collection}
        />
      </div>
    </div>
  )
}

const CollectionAdminEditsArea = (props: any) => {
  const router = useRouter()
  const session = useLHSession() as any;

  const deleteCollectionUI = async (collectionId: number) => {
    await deleteCollection(collectionId, session.data?.tokens?.access_token)
    await revalidateTags(['collections'], props.orgslug)
    // reload the page
    router.refresh()
  }

  return (
    <AuthenticatedClientElement
      action="delete"
      ressourceType="collections"
      orgId={props.org_id}
      checkMethod="roles"
    >
      <div className="z-20 relative">
        <ConfirmationModal
          confirmationMessage="Are you sure you want to delete this collection?"
          confirmationButtonText="Delete Collection"
          dialogTitle={'Delete ' + props.collection.name + '?'}
          dialogTrigger={
            <button
              className="absolute right-2 top-2 rounded-full bg-red-500/80 backdrop-blur-sm p-2 text-white transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg hover:shadow-red-500/25 border border-red-400/20"
              rel="noopener noreferrer"
            >
              <X size={18} />
            </button>
          }
          functionToExecute={() => deleteCollectionUI(props.collection_uuid)}
          status="warning"
        ></ConfirmationModal>
      </div>
    </AuthenticatedClientElement>
  )
}

export default CollectionThumbnail
