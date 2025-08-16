import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const Create = () => {

  const [activeTab, setActiveTab] = useState('en');
  const [languages, setLanguage] = useState([])
  const [genres, setGenre] = useState([])
  const [form, setForm] = useState({
    title:{},
    description:{},
    thumbnailUrl:{}
  })
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };  

  useEffect(() => {
    API.get('/languages').then((res) => {
      if(res.status == 200) {
        setLanguage(res.data)
      }
    })
    .catch((err) => {
      console.log('err --------------------', err)
    })
    API.get('/genre').then((res) => {
      if(res.status == 200) {
        setGenre(res.data)
      }
    })
    .catch((err) => {
      console.log('err --------------------', err)
    })
  }, [])

  console.log('form ------------- ', form)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post(`/contents`, form)
      if (res.status === 201) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Series created successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload()
        })
        
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to update plan',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    }
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Add Series</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="tab-buttons">
              {languages.map((language, ind) => (
                <button type="button" onClick={() => handleTabClick(language.code)} className={activeTab === language.code ? "active" : ""}>{language.display_name}</button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="tab-content">
              {languages.map((language, ind) => (
                activeTab === language.code && <div className='row' key={ind}>
                    <div className="my-2 col-md-6">
                      <label>Name ({language.code})</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        minLength={3}
                        value={form.title[language.code] ?? ''}
                        onChange={(e) => setForm({...form, title:{...form.title, [language.code]:e.target.value}}) }
                        required
                      />
                    </div>
                    <div className="my-2 col-md-6">
                      <label>Description ({language.code})</label>
                      <input
                        type="text"
                        name="description"
                        className="form-control"
                        minLength={3}
                        value={form.description[language.code] ?? ''}
                        onChange={(e) => setForm({...form, description:{...form.description, [language.code]:e.target.value}}) }
                        required
                      />
                    </div>
                    <div className="my-2 col-md-6">
                      <label>Thumbnail ({language.code})</label>
                      <input
                        type="file"
                        name="thumbnail"
                        className="form-control"
                        value={''}
                        onChange={(e) => {
                          const file = (e.target.files[0]);
                          setForm({...form, thumbnailUrl:{...form.thumbnailUrl, [language.code]:URL.createObjectURL(file)}})
                        }}
                      />
                    </div>
                </div>
              ))}
              <hr />
            </div>
            <div className="row">
              <div className="col-lg-4">
                <label>Release Date</label>
                <input
                    type="date"
                    name="release_date"
                    className="form-control"
                    value={form.releaseDate ?? ''}
                    onChange={(e) => setForm({...form, releaseDate:e.target.value}) }
                    required
                  />
              </div>
              <div className="col-lg-4">
                <label>Original Language</label>
                <select name="language" value={form.language} className="form-control" onChange={(e) => setForm({...form, language:e.target.value}) }>
                  {languages.map((language, ind) => (
                    <option value={language.code}>{language.display_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-4">
                <label>Genre</label>
                <select name="language" value={form.genre} className="form-control" onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                    setForm({ ...form, genre: selectedOptions });
                  }} multiple>
                  {genres.map((genre, ind) => (
                    <option value={genre.title}>{genre.title}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-4">
                <label>Season Number</label>
                <input
                    type="number"
                    name="seasonNumber"
                    className="form-control"
                    value={form.seasonNumber ?? ''}
                    onChange={(e) => setForm({...form, seasonNumber:e.target.value}) }
                    required
                  />
              </div>
              <div className="col-lg-4">
                <label>Episode Number</label>
                <input
                    type="number"
                    name="episodeNumber"
                    className="form-control"
                    value={form.episodeNumber ?? ''}
                    onChange={(e) => setForm({...form, episodeNumber:e.target.value}) }
                    required
                  />
              </div>
              <div className="col-lg-4">
                <label>Duration (In minutes)</label>
                <input
                    type="number"
                    name="duration"
                    className="form-control"
                    value={form.duration ?? ''}
                    onChange={(e) => setForm({...form, duration:e.target.value}) }
                    required
                  />
              </div>

              <div className="col-lg-4">
                <label>Is Downloadable</label>
                <select name="language" value={form.isDownloadable} className="form-control" onChange={(e) => setForm({...form, isDownloadable:e.target.value}) }>
                    <option value='0'>No</option>
                    <option value='1'>Yes</option>
                </select>
              </div>

            </div>

            
            <div className="row">
              <div className="my-2 col-md-12 w-25">
                <button type="submit" className="btn btn-primary mt-3">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Create
