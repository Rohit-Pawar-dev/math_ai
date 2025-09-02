import React, { useState, useEffect } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import API from '../../api'
import Swal from 'sweetalert2'

const UserBanners = () => {
  const [banners, setBanners] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await API.get('/user/banner')
        if (res.data.status) {
          setBanners(res.data.data)
        } else {
          Swal.fire('Error', 'Failed to fetch banners', 'error')
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong while fetching banners.', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  if (loading) return <p>Loading banners...</p>
  if (banners.length === 0) return <p>No banners available</p>

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {banners.map((banner) => (
        <Carousel.Item key={banner._id}>
          <img
            className="d-block w-100"
            src={banner.image}
            alt={banner.title}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>{banner.title}</h3>
            {/* You can add banner.type or other info here */}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default UserBanners
