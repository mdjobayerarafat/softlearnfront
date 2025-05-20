'use client'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import UserAvatar from '@components/Objects/UserAvatar';
import { getAPIUrl, getUriWithOrg, getUriWithoutOrg } from '@services/config/config';
import { swrFetcher } from '@services/utils/ts/requests';
import { ArrowRightCircle, Info, Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import learnhouseIcon from 'public/learnhouse_bigicon_1.png'
import React, { useState } from 'react'
import useSWR from 'swr';

function HomeClient() {
  const session = useLHSession() as any;
  const access_token = session?.data?.tokens?.access_token;
  const { data: orgs, error, isLoading } = useSWR(
    access_token ? `${getAPIUrl()}orgs/user/page/1/limit/10` : null,
    (url) => swrFetcher(url, access_token)
  );
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: true, callbackUrl: getUriWithoutOrg('/') });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Modern header with centered logo and brand */}
      <header className="w-full bg-black text-white py-8 rounded-b-3xl shadow-lg">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <Image
            quality={100}
            width={70}
            height={70}
            src={learnhouseIcon}
            alt="LearnHouse Logo"
            priority
            className="mb-2"
          />
          <h1 className="text-xl font-bold tracking-wider mt-2">SoftLearn</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-2xl">
        {/* User greeting - centered with improved spacing */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-medium text-gray-700">Hello,</span>
            <UserAvatar />
          </div>
          <span className="capitalize text-2xl font-semibold text-gray-800 mt-2">
            {session?.data?.user.first_name} {session?.data?.user.last_name}
          </span>
        </div>

        {/* Organizations section with centered title */}
        <div className="my-10">
          <div className="flex justify-center mb-6">
            <h2 className="text-sm font-semibold uppercase bg-slate-200 text-gray-600 px-5 py-2 rounded-full">
              Your Organizations
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-500" size={30} />
            </div>
          ) : error ? (
            <div className="flex items-center space-x-3 bg-rose-200 rounded-lg px-4 py-3 max-w-md mx-auto">
              <Info className="text-rose-600 shrink-0" />
              <span>Unable to load your organizations. Please try again later.</span>
            </div>
          ) : orgs?.length === 0 ? (
            <div className="flex items-center space-x-3 bg-rose-100 rounded-lg px-4 py-3 border border-rose-200 max-w-md mx-auto">
              <Info className="text-rose-600 shrink-0" />
              <span>It seems you're not part of an organization yet. Join one to see it here.</span>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              {orgs?.map((org: any) => (
                <Link
                  href={getUriWithOrg(org.slug, '/')}
                  key={org.id}
                  className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all hover:bg-slate-50"
                >
                  <div className="font-medium">{org.name}</div>
                  <ArrowRightCircle className="text-blue-600" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer with centered sign out button */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 mx-auto px-5 py-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isSigningOut ?
            <Loader2 className="animate-spin" size={18} /> :
            <LogOut size={18} />
          }
          <span>Sign out</span>
        </button>
      </footer>
    </div>
  );
}

export default HomeClient