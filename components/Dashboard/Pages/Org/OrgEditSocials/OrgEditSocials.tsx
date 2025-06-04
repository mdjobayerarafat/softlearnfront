'use client'
import React from 'react'
import { Form, Formik } from 'formik'
import { updateOrganization } from '@services/settings/org'
import { revalidateTags } from '@services/utils/ts/requests'
import { useOrg } from '@components/Contexts/OrgContext'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { toast } from 'react-hot-toast'
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { 
  SiX, 
  SiFacebook, 
  SiInstagram, 
  SiYoutube 
} from '@icons-pack/react-simple-icons'
import { Plus, X as XIcon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'
import { getAPIUrl } from '@services/config/config'

interface OrganizationValues {
  socials: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  links: {
    [key: string]: string
  }
}

export default function OrgEditSocials() {
  const session = useLHSession() as any
  const access_token = session?.data?.tokens?.access_token
  const org = useOrg() as any
  const router = useRouter()
  
  const initialValues: OrganizationValues = {
    socials: org?.socials || {},
    links: org?.links || {}
  }

  const updateOrg = async (values: OrganizationValues) => {
    const loadingToast = toast.loading('Updating organization...')
    try {
      await updateOrganization(org.id, values, access_token)
      await revalidateTags(['organizations'], org.slug)
      mutate(`${getAPIUrl()}orgs/slug/${org.slug}`)
      toast.success('Organization Updated', { id: loadingToast })
    } catch (err) {
      console.error('Failed to update organization:', err)
      toast.error('Failed to update organization', { id: loadingToast })
    }
  }

  return (
    <div className="sm:mx-10 mx-0 bg-slate-900/70 backdrop-blur-sm rounded-xl nice-shadow border border-white/10">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          updateOrg(values).finally(() => setSubmitting(false))
        }}
      >
        {({ isSubmitting, values, handleChange, setFieldValue }) => (
          <Form>
            <div className="flex flex-col gap-0">
              <div className="flex flex-col bg-gray-50 -space-y-1 px-5 py-3 mx-3 my-3 rounded-md">
                <h1 className="font-bold text-xl text-gray-800">
                  Social Links
                </h1>
                <h2 className="text-gray-500 text-md">
                  Manage your organization's social media presence
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row lg:space-x-8 mt-0 mx-5 my-5">
                <div className="w-full space-y-6">
                  <div>
                    <Label className="text-lg font-semibold">Social Links</Label>
                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg nice-shadow mt-2">
                      <div className="grid gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#1DA1F2]/10 rounded-md">
                            <SiX size={16} color="#1DA1F2"/>
                          </div>
                          <Input
                            id="socials.twitter"
                            name="socials.twitter"
                            value={values.socials.twitter || ''}
                            onChange={handleChange}
                            placeholder="Twitter/X profile URL"
                            className="h-9 bg-slate-800/60 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#1877F2]/10 rounded-md">
                            <SiFacebook size={16} color="#1877F2"/>
                          </div>
                          <Input
                            id="socials.facebook"
                            name="socials.facebook"
                            value={values.socials.facebook || ''}
                            onChange={handleChange}
                            placeholder="Facebook page URL"
                            className="h-9 bg-slate-800/60 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#E4405F]/10 rounded-md">
                            <SiInstagram size={16} color="#E4405F"/>
                          </div>
                          <Input
                            id="socials.instagram"
                            name="socials.instagram"
                            value={values.socials.instagram || ''}
                            onChange={handleChange}
                            placeholder="Instagram profile URL"
                            className="h-9 bg-slate-800/60 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#FF0000]/10 rounded-md">
                            <SiYoutube size={16} color="#FF0000"/>
                          </div>
                          <Input
                            id="socials.youtube"
                            name="socials.youtube"
                            value={values.socials.youtube || ''}
                            onChange={handleChange}
                            placeholder="YouTube channel URL"
                            className="h-9 bg-slate-800/60 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-6 lg:mt-0 mt-6">
                  <div>
                    <Label className="text-lg font-semibold">Custom Links</Label>
                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg nice-shadow mt-2">
                      {Object.entries(values.links).map(([linkKey, linkValue], index) => (
                        <div key={`${linkKey}-${index}`} className="flex gap-3 items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-gray-200/50 rounded-md text-xs font-medium text-gray-600">
                            {index + 1}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <Input
                              placeholder="Label"
                              value={linkKey}
                              className="h-9 w-1/3 bg-slate-800/60 border-white/20 text-white placeholder:text-blue-200"
                              onChange={(e) => {
                                const newKey = e.target.value
                                if (newKey !== linkKey) {
                                  const newLinks = { ...values.links }
                                  delete newLinks[linkKey]
                                  if (newKey.trim()) {
                                    newLinks[newKey] = linkValue
                                  }
                                  setFieldValue('links', newLinks)
                                }
                              }}
                            />
                            <Input
                              placeholder="URL"
                              value={linkValue}
                              className="h-9 flex-1 bg-slate-800/60 border-white/20 text-white placeholder:text-blue-200"
                              onChange={(e) => {
                                const newLinks = { ...values.links }
                                newLinks[linkKey] = e.target.value
                                setFieldValue('links', newLinks)
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                const newLinks = { ...values.links }
                                delete newLinks[linkKey]
                                setFieldValue('links', newLinks)
                              }}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {Object.keys(values.links).length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
                          onClick={() => {
                            const linkCount = Object.keys(values.links).length
                            const newLinks = { ...values.links }
                            newLinks[`Link ${linkCount + 1}`] = ''
                            setFieldValue('links', newLinks)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Link
                        </Button>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Add up to 3 custom links that will appear on your organization's profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row-reverse mt-3 mx-5 mb-5">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
