import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../../api'

const ReelsView = () => {
  const { id } = useParams()
  const [reel, setReel] = useState(null)

  useEffect(() => {
    API.get(`/reels/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setReel(res.data)
        }
      })
      .catch((err) => console.error(err))
  }, [id])

  if (!reel) {
    return <p>Loading reel details...</p>
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2>Reel Details</h2>
        <p><strong>Title (EN):</strong> {reel.title?.en}</p>
        <p><strong>Description (EN):</strong> {reel.description?.en}</p>
        <p><strong>Status:</strong> {reel.status}</p>
        <p><strong>Views:</strong> {reel.views}</p>
        <p>
          <strong>Video Link:</strong>{' '}
          <a href={reel.video_link} target="_blank" rel="noopener noreferrer">
            Watch Reel
          </a>
        </p>

        {reel.video_link && (
          <div className="mt-3">
            <video
              src={reel.video_link}
              controls
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReelsView
