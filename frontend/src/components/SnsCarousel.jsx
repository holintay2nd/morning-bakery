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
  const [ytChannelName,      setYtChannelName]      = useState('')
  const [ytChannelAvatar,    setYtChannelAvatar]    = useState('')
  const [ytChannelUrl,       setYtChannelUrl]       = useState('')
  const [ytSubscriberCount,  setYtSubscriberCount]  = useState(null)
  const [ytVideoCount,       setYtVideoCount]       = useState(null)
  const [nbBlogTitle,      setNbBlogTitle]      = useState('')
  const [nbBlogUrl,        setNbBlogUrl]        = useState('')
  const [thUsername,       setThUsername]       = useState('')
  const [thProfilePicture, setThProfilePicture] = useState('')
  const [thFollowersCount, setThFollowersCount] = useState(null)
  const [thMediaCount,     setThMediaCount]     = useState(null)
  const [taglines,         setTaglines]         = useState({})
  const [igProfile,        setIgProfile]        = useState(null)
  const [igMediaCount,     setIgMediaCount]     = useState(null)
  const [igFollowersCount, setIgFollowersCount] = useState(null)
  const [loading,          setLoading]          = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get('/content/sns'),
      api.get('/instagram/feed'),
      api.get('/youtube/feed'),
      api.get('/threads/feed'),
      api.get('/naverblog/feed'),
      api.get('/content/sns-taglines'),
      api.get('/content/sns-profiles'),
    ]).then(([snsResult, igResult, ytResult, thResult, nbResult, taglineResult, profilesResult]) => {
      const sns    = snsResult.status     === 'fulfilled' ? snsResult.value.data     : {}
      const igData = igResult.status      === 'fulfilled' ? igResult.value.data      : null
      const ytData = ytResult.status      === 'fulfilled' ? ytResult.value.data      : null
      const thData = thResult.status      === 'fulfilled' ? thResult.value.data      : null
      const nbData = nbResult.status      === 'fulfilled' ? nbResult.value.data      : null
      const tlData = taglineResult.status === 'fulfilled' ? taglineResult.value.data : {}

      const igItems = Array.isArray(igData) ? igData : (igData?.items ?? null)
      if (igData?.username)         setIgUsername(igData.username)
      if (igData?.profilePicture)   setIgProfilePicture(igData.profilePicture)
      if (igData?.mediaCount     != null) setIgMediaCount(igData.mediaCount)
      if (igData?.followersCount != null) setIgFollowersCount(igData.followersCount)

      const ytItems = Array.isArray(ytData) ? ytData : (ytData?.items ?? null)
      if (ytData?.channelName)   setYtChannelName(ytData.channelName)
      if (ytData?.channelAvatar) setYtChannelAvatar(ytData.channelAvatar)
      if (ytData?.channelUrl)    setYtChannelUrl(ytData.channelUrl)
      if (ytData?.subscriberCount != null) setYtSubscriberCount(ytData.subscriberCount)
      if (ytData?.videoCount      != null) setYtVideoCount(ytData.videoCount)

      const nbItems = Array.isArray(nbData) ? nbData : (nbData?.items ?? null)
      if (nbData?.blogTitle) setNbBlogTitle(nbData.blogTitle)
      if (nbData?.blogUrl)   setNbBlogUrl(nbData.blogUrl)

      const thItems = Array.isArray(thData) ? thData : (thData?.items ?? null)
      if (thData?.username)       setThUsername(thData.username)
      if (thData?.profilePicture) setThProfilePicture(thData.profilePicture)
      if (thData?.followersCount != null) setThFollowersCount(thData.followersCount)
      if (thData?.mediaCount     != null) setThMediaCount(thData.mediaCount)

      if (tlData) setTaglines(tlData)

      const profiles = profilesResult.status === 'fulfilled' ? profilesResult.value.data : {}
      if (profiles.instagram) setIgProfile(profiles.instagram)

      setSnsData({
        ...sns,
        instagram: igItems ?? sns.instagram ?? [],
        youtube:   ytItems ?? sns.youtube   ?? [],
        threads:   thItems ?? sns.threads   ?? [],
        naverBlog: nbItems ?? sns.naverBlog ?? [],
      })
    }).finally(() => setLoading(false))
  }, [])

  // 로딩 / 에러 공통 래퍼
  const statusContent = loading ? (
    <div className="py-20 px-8">
      <div className="max-w-6xl mx-auto"><SnsSkeleton /></div>
    </div>
  ) : !snsData ? (
    <div className="py-20 text-center text-brown-400 text-sm">SNS 정보를 불러올 수 없습니다.</div>
  ) : null

  return (
    <section id="sns" className="bg-white scroll-mt-24">

      {/* ── 데스크탑 헤더 (모바일 숨김) ── */}
      <div className="hidden md:block pt-24 pb-10 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="section-subtitle">SNS</p>
          <h2 className="section-title mb-3">SNS에서 만나요</h2>
          <p className="text-brown-400 text-sm">
            인스타그램, 유튜브, 네이버 블로그 등 다양한 채널에서 모닝베이커리의 소식을 전해드립니다.
          </p>
        </div>
      </div>

      {statusContent ?? (
        <>
          {/*
           * 각 플랫폼을 mobile-snap-section 으로 감싸 모바일에서 독립 전체화면 섹션으로 만듦.
           * 데스크탑에서는 mobile-snap-section 클래스가 미디어쿼리 밖이라 일반 block 으로만 동작.
           * 내부 md:max-w-6xl md:mx-auto md:px-8 은 데스크탑 레이아웃 컨테이너.
           */}
          <div className="mobile-snap-section">
            <div className="md:max-w-6xl md:mx-auto md:px-8">
              <InstagramSection
                items={snsData.instagram ?? []}
                username={igUsername}
                profilePicture={igProfilePicture}
                tagline={taglines.instagram}
                igProfile={{
                  ...(igProfile || {}),
                  mediaCount:     igMediaCount     ?? igProfile?.mediaCount     ?? null,
                  followersCount: igFollowersCount ?? igProfile?.followersCount ?? null,
                }}
              />
            </div>
          </div>

          <div className="mobile-snap-section">
            <div className="md:max-w-6xl md:mx-auto md:px-8">
              <YoutubeSection
                items={snsData.youtube ?? []}
                channelName={ytChannelName}
                channelAvatar={ytChannelAvatar}
                channelUrl={ytChannelUrl}
                tagline={taglines.youtube}
                subscriberCount={ytSubscriberCount}
                videoCount={ytVideoCount}
              />
            </div>
          </div>

          <div className="mobile-snap-section">
            <div className="md:max-w-6xl md:mx-auto md:px-8">
              <NaverBlogSection
                items={snsData.naverBlog ?? []}
                blogTitle={nbBlogTitle}
                blogUrl={nbBlogUrl}
                tagline={taglines.naverBlog}
              />
            </div>
          </div>

          <div className="mobile-snap-section">
            <div className="md:max-w-6xl md:mx-auto md:px-8 md:pb-16">
              <ThreadsSection
                items={snsData.threads ?? []}
                username={thUsername}
                profilePicture={thProfilePicture}
                tagline={taglines.threads}
                followersCount={thFollowersCount}
                mediaCount={thMediaCount}
              />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
