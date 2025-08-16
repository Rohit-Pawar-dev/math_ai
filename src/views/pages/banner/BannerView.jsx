import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../api';
import Swal from 'sweetalert2';

const BannerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [seriesList, setSeriesList] = useState([]);

  useEffect(() => {
    // Fetch banner
    API.get(`/banners/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setBanner(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load banner details', 'error');
      });

    // Fetch all series for mapping titles
    API.get('/contents')
      .then((res) => {
        if (res.status === 200) {
          const seriesOnly = res.data.filter((item) => item.type === 'series');
          setSeriesList(seriesOnly);
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch series', 'error'));
  }, [id]);

  if (!banner) return <div className="p-4">Loading...</div>;

  const getSeriesTitles = () => {
    return (banner.series || [])
      .map((sid) => seriesList.find((s) => s._id === sid))
      .filter(Boolean)
      .map((s) => s.title?.en || s.title?.hi || 'Untitled')
      .join(', ');
  };

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Banner Details</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            {Object.entries(banner.title || {}).map(([lang, val]) => (
              <Detail key={`title-${lang}`} label={`Title (${lang})`} value={val} />
            ))}

            <Detail label="Status" value={banner.status} />
            <Detail label="Type" value={banner.type || 'N/A'} />

            {Object.entries(banner.image || {}).map(([lang, url]) => (
              <div className="col-md-6 mb-3" key={`img-${lang}`}>
                <label className="form-label"><strong>Image ({lang})</strong></label>
                <div className="border p-2">
                  <img
                    src={url}
                    alt={`Banner in ${lang}`}
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}

            {banner.type === 'custom' && (
              <Detail label="Series" value={getSeriesTitles()} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label"><strong>{label}</strong></label>
    <p className="form-control-plaintext">{value}</p>
  </div>
);

export default BannerView;
