import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../../api';
import Swal from 'sweetalert2';
import Select from 'react-select';
import customSelectStyles from '../../../assets/reactSelectStyles';

const Edit = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('en');
  const [languages, setLanguages] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  const [form, setForm] = useState({
    title: {},
    description: {},
    thumbnailUrl: {},
    releaseDate: '',
    language: '',
    genres: [],
    seasonNumber: '',
    episodeNumber: '',
    duration: '',
    isDownloadable: '0',
  });

  const formatDate = (isoDateStr) => {
    if (!isoDateStr) return '';
    const date = new Date(isoDateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    API.get(`/contents/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data);
        }
      })
      .catch((err) => console.error('Content Fetch Error:', err));

    API.get('/languages')
      .then((res) => {
        if (res.status === 200) {
          setLanguages(res.data);
          const defaultLang = res.data[0]?.code || 'en';
          setActiveTab(defaultLang);
        }
      })
      .catch((err) => console.error('Language Fetch Error:', err));

    API.get('/genre')
      .then((res) => {
        if (res.status === 200) {
          setGenreOptions(res.data);
        }
      })
      .catch((err) => console.error('Genre Fetch Error:', err));
  }, [id]);

  const handleImageUpload = (e, lang) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('type', 'thumbnail');
    formData.append('file', file);

    API.post('/upload-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        if (res.status === 200) {
          const fileUrl = res.data.file.replace(/\\/g, '/');
          setForm((prev) => ({
            ...prev,
            thumbnailUrl: { ...prev.thumbnailUrl, [lang]: fileUrl },
          }));
          Swal.fire('Success', 'Thumbnail uploaded successfully', 'success');
        }
      })
      .catch((error) => {
        console.error('Upload failed:', error);
        Swal.fire('Error', 'Failed to upload thumbnail', 'error');
      });
  };

  const formattedGenres = genreOptions.map((genre) => ({
    value: genre?.value?.en || genre?.title?.en || '',
    label: genre?.label?.[activeTab] || genre?.title?.en || 'Untitled',
  }));

  const selectedGenreValues = form.genres?.map((gVal) => {
    const matched = genreOptions.find((g) => g?.value?.en === gVal || g?.title?.en === gVal);
    return {
      value: gVal,
      label: matched?.label?.[activeTab] || matched?.label?.en || gVal,
    };
  }) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/contents/${id}`, form);
      if (res.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Series updated successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to update series',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Edit Series</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="tab-buttons mb-3">
              {languages.map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  className={`btn btn-sm me-2 ${activeTab === lang.code ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveTab(lang.code)}
                >
                  {lang.display_name}
                </button>
              ))}
            </div>

            {languages.map((lang) =>
              activeTab === lang.code ? (
                <div key={lang.code} className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label>Title ({lang.code})</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.title?.[lang.code] || ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          title: { ...prev.title, [lang.code]: e.target.value },
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Description ({lang.code})</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.description?.[lang.code] || ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: { ...prev.description, [lang.code]: e.target.value },
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Thumbnail ({lang.code})</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, lang.code)}
                    />
                    {form.thumbnailUrl?.[lang.code] && (
                      <img
                        src={form.thumbnailUrl[lang.code]}
                        alt="Thumbnail"
                        className="mt-2"
                        style={{ maxWidth: '100px', height: 'auto' }}
                      />
                    )}
                  </div>
                </div>
              ) : null
            )}

            <hr />

            <div className="row">
              <div className="col-lg-4 mb-3">
                <label>Release Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formatDate(form.releaseDate)}
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
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.display_name}
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
                      genres: selected ? selected.map((s) => s.value) : [],
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
                  <div class="formSubmitDiv">
            <button type="submit" className="btn btn-primary mt-3">
              Save
            </button></div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Edit;
