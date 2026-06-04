import { useState, useEffect } from 'react'
import api from '../api'
import InstagramSection from './sns/InstagramSection'
import YoutubeSection   from './sns/YoutubeSection'
import NaverBlogSection from './sns/NaverBlogSection'
import ThreadsSection   from './sns/ThreadsSection'
import SnsSkeleton      from './sns/SnsSkeleton'

const IG_INIT = { items: [], username: '', profilePicture: '', mediaCount: null, followersCount: null }
const YT_INIT = { items: [], channelName: '', channelAvatar: '', channelUrl: '', subscriberCount: null, videoCount: null }
const NB_INIT = { items: [], blogTitle: '', blogUrl: '' }
const TH_INIT = { items: [], username: '', profilePicture: '', followersCount: null, mediaCount: null }

export default function SnsCarousel() {
  const [igState,   setIgState]   = useState(IG_INIT)
  const [ytState,   setYtState]   = useState(YT_INIT)
  const [nbState,   setNbState]   = useState(NB_INIT)
  const [thState,   setThState]   = useState(TH_INIT)
  const [taglines,  setTaglines]  = useState({})
  const [igProfile, setIgProfile] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get('/content/sns'),
      api.get('/instagram/feed'),
      api.get('/youtube/feed'),
      api.get('/threads/feed'),
      api.get('/naverblog/feed'),
      api.get('/content/sns-taglines'),
      api.get('/content/sns-profiles'),
    ]).then(([snsRes, igRes, ytRes, thRes, nbRes, tlRes, profRes]) => {
      const sns = snsRes.status === 'fulfilled' ? snsRes.value.data : {}

      const igData = igRes.status === 'fulfilled' ? igRes.value.data : null
      const igItems = Array.isArray(igData) ? igData : (igData?.items ?? null)
      setIgState({
        items:          igItems           ?? sns.instagram ?? [],
        username:       igData?.username       || '',
        profilePicture: igData?.profilePicture || '',
        mediaCount:     igData?.mediaCount     ?? null,
        followersCount: igData?.followersCount ?? null,
      })

      const ytData = ytRes.status === 'fulfilled' ? ytRes.value.data : null
      const ytItems = Array.isArray(ytData) ? ytData : (ytData?.items ?? null)
      setYtState({
        items:           ytItems            ?? sns.youtube ?? [],
        channelName:     ytData?.channelName    || '',
        channelAvatar:   ytData?.channelAvatar  || '',
        channelUrl:      ytData?.channelUrl     || '',
        subscriberCount: ytData?.subscriberCount ?? null,
        videoCount:      ytData?.videoCount      ?? null,
      })

      const nbData = nbRes.status === 'fulfilled' ? nbRes.value.data : null
      const nbItems = Array.isArray(nbData) ? nbData : (nbData?.items ?? null)
      setNbState({
        items:     nbItems          ?? sns.naverBlog ?? [],
        blogTitle: nbData?.blogTitle || '',
        blogUrl:   nbData?.blogUrl   || '',
      })

      const thData = thRes.status === 'fulfilled' ? thRes.value.data : null
      const thItems = Array.isArray(thData) ? thData : (thData?.items ?? null)
      setThState({
        items:          thItems           ?? sns.threads ?? [],
        username:       thData?.username       || '',
        profilePicture: thData?.profilePicture || '',
        followersCount: thData?.followersCount ?? null,
        mediaCount:     thData?.mediaCount     ?? null,
      })

      const tl = tlRes.status === 'fulfilled' ? tlRes.value.data : {}
      setTaglines(tl || {})

      const profiles = profRes.status === 'fulfilled' ? profRes.value.data : {}
      if (profiles.instagram) setIgProfile(profiles.instagram)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="sns" className="bg-white scroll-mt-24">
        <div className="hidden md:block pt-24 pb-10 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p className="section-subtitle">SNS</p>
            <h2 className="section-title mb-3">SNS에서 만나요</h2>
            <p className="text-brown-400 text-sm">
              인스타그램, 유튜브, 네이버 블로그 등 다양한 채널에서 모닝베이커리의 소식을 전해드립니다.
            </p>
          </div>
        </div>
        <div className="py-20 px-8">
          <div className="max-w-6xl mx-auto"><SnsSkeleton /></div>
        </div>
      </section>
    )
  }

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

      <div className="mobile-snap-section">
        <div className="md:max-w-6xl md:mx-auto md:px-8">
          <InstagramSection
            items={igState.items}
            username={igState.username}
            profilePicture={igState.profilePicture}
            tagline={taglines.instagram}
            igProfile={{
              ...(igProfile || {}),
              mediaCount:     igState.mediaCount     ?? igProfile?.mediaCount     ?? null,
              followersCount: igState.followersCount ?? igProfile?.followersCount ?? null,
            }}
          />
        </div>
      </div>

      <div className="mobile-snap-section">
        <div className="md:max-w-6xl md:mx-auto md:px-8">
          <YoutubeSection
            items={ytState.items}
            channelName={ytState.channelName}
            channelAvatar={ytState.channelAvatar}
            channelUrl={ytState.channelUrl}
            tagline={taglines.youtube}
            subscriberCount={ytState.subscriberCount}
            videoCount={ytState.videoCount}
          />
        </div>
      </div>

      <div className="mobile-snap-section">
        <div className="md:max-w-6xl md:mx-auto md:px-8">
          <NaverBlogSection
            items={nbState.items}
            blogTitle={nbState.blogTitle}
            blogUrl={nbState.blogUrl}
            tagline={taglines.naverBlog}
          />
        </div>
      </div>

      <div className="mobile-snap-section">
        <div className="md:max-w-6xl md:mx-auto md:px-8 md:pb-16">
          <ThreadsSection
            items={thState.items}
            username={thState.username}
            profilePicture={thState.profilePicture}
            tagline={taglines.threads}
            followersCount={thState.followersCount}
            mediaCount={thState.mediaCount}
          />
        </div>
      </div>

    </section>
  )
}
