import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import Select from 'react-select'
import customSelectStyles from '../../../assets/reactSelectStyles'

const Create = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('en')
  const [languages, setLanguages] = useState([])
  const [genreOptions, setGenreOptions] = useState([])
console.log('genreOptions', genreOptions);

  const [form, setForm] = useState({
    title: {},
    description: {},
    thumbnailUrl: {},
    releaseDate: '',
    language: '',
    genre: [],
    seasonNumber: '',
    episodeNumber: '',
    duration: '',
    isDownloadable: '0',
  })

  useEffect(() => {
    API.get('/languages')
      .then((res) => {
        if (res.status === 200) {
          setLanguages(res.data)
          const defaultLang = res.data[0]?.code || 'en'
          setActiveTab(defaultLang)
          setForm((prev) => ({ ...prev, language: defaultLang }))
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch languages', 'error'))

    API.get('/genre')
      .then((res) => {
        if (res.status === 200) {
          setGenreOptions(res.data) // Keep raw for now, we’ll format for select below
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch genres', 'error'))
  }, [])

// <<<<<<< rohit-admin
//   const handleImageChange = async (lang, file) => {
//     if (!file) return
//     const formData = new FormData()
//     formData.append('type', 'thumbnail')
//     formData.append('file', file)

//     try {
//       const res = await API.post('/upload-media', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       if (res.status === 200) {
//         const fileUrl = res.data.file.replace(/\\/g, '/')
//         setForm((prev) => ({
//           ...prev,
//           thumbnailUrl: { ...prev.thumbnailUrl, [lang]: fileUrl },
//         }))
//         Swal.fire('Success', 'Thumbnail uploaded successfully', 'success')
//       }
//     } catch (error) {
//       console.error('Upload failed:', error)
//       Swal.fire('Error', 'Failed to upload thumbnail', 'error')
//     }
//   }
// =======
  // const handleImageUpload = (e, code) => {
  //   const file = e.target.files[0]
  //   if (!file) return

  //   const reader = new FileReader()
  //   reader.onloadend = () => {
  //     setForm((prev) => ({
  //       ...prev,
  //       thumbnailUrl: {
  //         ...prev.thumbnailUrl,
  //         [code]: reader.result,
  //       },
  //     }))
  //   }
  //   reader.readAsDataURL(file)
  // }

  const handleImageUpload = (e, code) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // setBase64Image(reader.result); // base64 string
      console.log(reader.result);    // ⬅️ logs the base64 image

      setForm({...form, thumbnailUrl:{...form.thumbnailUrl, [code]:reader.result}})

    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/contents', form)
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
          navigate('/series')
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to create series',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    }
  }

  const formattedGenres = genreOptions.map((genre) => ({
    value: genre?.title?.en || '', // fallback to empty string if missing
    label: genre?.label?.[activeTab] || genre?.title?.en || 'Untitled',
  }))

  const selectedGenreValues = form.genre.map((gVal) => {
    const matched = genreOptions.find((g) => g?.value?.en === gVal)
    return {
      value: gVal,
      label: matched?.label?.[activeTab] || matched?.label?.en || gVal,
    }
  })

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Add Series</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Language Tabs */}
            <div className="tab-buttons mb-3">
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  className={`btn btn-sm me-2 ${
                    activeTab === language.code ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setActiveTab(language.code)}
                >
                  {language.display_name}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {languages.map(
              (language) =>
                activeTab === language.code && (
                  <div key={language.code} className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label>Title ({language.code})</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.title[language.code] || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            title: { ...prev.title, [language.code]: e.target.value },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Description ({language.code})</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.description[language.code] || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            description: { ...prev.description, [language.code]: e.target.value },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Thumbnail ({language.code})</label>
                      <input
                        type="file"
                        className="form-control"

                        value={''}
                        onChange={(e) => {
                          handleImageUpload(e, language.code)
                        }}

                      />
                      {form.thumbnailUrl[language.code] && (
                        <img
                          src={form.thumbnailUrl[language.code]}
                          alt="Thumbnail"
                          className="mt-2"
                          style={{ maxWidth: '200px', height: 'auto' }}
                        />
                      )}
                    </div>
                  </div>
                ),
            )}

            <hr />

            <div className="row">
              <div className="col-lg-4 mb-3">
                <label>Release Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.releaseDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, releaseDate: e.target.value }))}
                  required
                />
              </div>

              <div className="col-lg-4 mb-3">
                <label>Original Language</label>
                <select
                  className="form-control"
                  value={form.language}
                  onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-4 mb-3">
                <label>Genre</label>
                <Select
                  isMulti
                  options={formattedGenres}
                  value={selectedGenreValues}
                  onChange={(selected) =>
                    setForm((prev) => ({
                      ...prev,
                      genre: selected ? selected.map((s) => s.value) : [],
                    }))
                  }
                  classNamePrefix="react-select"
                  styles={customSelectStyles}
                />
              </div>

              <div className="col-lg-4 mb-3">
                <label>Season Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.seasonNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, seasonNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="col-lg-4 mb-3">
                <label>Episode Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.episodeNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, episodeNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="col-lg-4 mb-3">
                <label>Duration (in minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.duration}
                  onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  required
                />
              </div>

              <div className="col-lg-4">
                <label>Is Featured</label>
                <select name="language" value={form.is_featured} className="form-control" onChange={(e) => setForm({...form, is_featured:e.target.value}) }>
                    <option value='0'>No</option>
                    <option value='1'>Yes</option>
                </select>
              </div>

              <div className="col-lg-4">
                <label>Is Downloadable</label>
                <select
                  className="form-control"
                  value={form.isDownloadable}
                  onChange={(e) => setForm((prev) => ({ ...prev, isDownloadable: e.target.value }))}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success mt-3">
              Save Series
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Create
