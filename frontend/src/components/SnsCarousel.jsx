import { useState, useEffect } from 'react'
import api from '../api'
import InstagramSection from './sns/InstagramSection'
import YoutubeSection   from './sns/YoutubeSection'
import NaverBlogSection from './sns/NaverBlogSection'
import ThreadsSection   from './sns/ThreadsSection'
import SnsSkeleton      from './sns/SnsSkeleton'

export default function SnsCarousel() {
  const [snsData,          setSnsData]          = useState(null)
  const [igUsername,       setIgUsername]       = useState('')
  const [igProfilePicture, setIgProfilePicture] = useState('')
  const [ytChannelName,    setYtChannelName]    = useState('')
  const [ytChannelAvatar,  setYtChannelAvatar]  = useState('')
  const [nbBlogTitle,      setNbBlogTitle]      = useState('')
  const [thUsername,       setThUsername]       = useState('')
  const [thProfilePicture, setThProfilePicture] = useState('')
  const [loading,          setLoading]          = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get('/content/sns'),
      api.get('/instagram/feed'),
      api.get('/youtube/feed'),
      api.get('/threads/feed'),
      api.get('/naverblog/feed'),
    ]).then(([snsResult, igResult, ytResult, thResult, nbResult]) => {
      const sns    = snsResult.status === 'fulfilled' ? snsResult.value.data : {}
      const igData = igResult.status === 'fulfilled'  ? igResult.value.data  : null
      const ytData = ytResult.status === 'fulfilled'  ? ytResult.value.data  : null
      const thData = thResult.status === 'fulfilled'  ? thResult.value.data  : null
      const nbData = nbResult.status === 'fulfilled'  ? nbResult.value.data  : null

      const igItems = Array.isArray(igData) ? igData : (igData?.items ?? null)
      if (igData?.username)       setIgUsername(igData.username)
      if (igData?.profilePicture) setIgProfilePicture(igData.profilePicture)

      const ytItems = Array.isArray(ytData) ? ytData : (ytData?.items ?? null)
      if (ytData?.channelName)   setYtChannelName(ytData.channelName)
      if (ytData?.channelAvatar) setYtChannelAvatar(ytData.channelAvatar)

      const nbItems = Array.isArray(nbData) ? nbData : (nbData?.items ?? null)
      if (nbData?.blogTitle) setNbBlogTitle(nbData.blogTitle)

      const thItems = Array.isArray(thData) ? thData : (thData?.items ?? null)
      if (thData?.username)       setThUsername(thData.username)
      if (thData?.profilePicture) setThProfilePicture(thData.profilePicture)

      setSnsData({
        ...sns,
        instagram: igItems ?? sns.instagram ?? [],
        youtube:   ytItems ?? sns.youtube   ?? [],
        threads:   thItems ?? sns.threads   ?? [],
        naverBlog: nbItems ?? sns.naverBlog ?? [],
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <section id="sns" className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="section-subtitle">Follow Us</p>
        <h2 className="section-title mb-3">SNS에서 만나요</h2>
        <p className="text-center text-brown-400 text-sm mb-14">
          인스타그램, 유튜브, 네이버 블로그 등 다양한 채널에서 모닝베이커리의 소식을 전해드립니다.
        </p>

        {loading ? (
          <SnsSkeleton />
        ) : !snsData ? (
          <div className="py-20 text-center text-brown-400 text-sm">SNS 정보를 불러올 수 없습니다.</div>
        ) : (
          <div>
            <InstagramSection
              items={snsData.instagram ?? []}
              username={igUsername}
              profilePicture={igProfilePicture}
            />
            <YoutubeSection
              items={snsData.youtube ?? []}
              channelName={ytChannelName}
              channelAvatar={ytChannelAvatar}
            />
            <NaverBlogSection
              items={snsData.naverBlog ?? []}
              blogTitle={nbBlogTitle}
            />
            <ThreadsSection
              items={snsData.threads ?? []}
              username={thUsername}
              profilePicture={thProfilePicture}
            />
          </div>
        )}
      </div>
    </section>
  )
}
