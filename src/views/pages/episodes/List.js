import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilLowVision, cilEyedropper, cilOpentype, cilViewColumn, cilDelete } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import JSZip from "jszip";

const List = () => {

  const { series_id } = useParams()

  const [form, setForm] = useState(null);
  const [mp4Count, setMp4Count] = useState(null);
  const [list, setEpisodeList] = useState([])

  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [series, setSeries] = useState([])
  const [episodes, setEpisodes] = useState([])
  useEffect(function () {
    API.get('/episodes/' + series_id) // Replace with actual API route
      .then((res) => {
        if (res.status == 200) {
          setEpisodes(res.data)
        }
      })
      .catch((err) => console.error(err))
    API.get('/contents/' + series_id) // Replace with actual API route
      .then((res) => {
        if (res.status == 200) {
          setSeries(res.data)

          console.log()
        }
      })
      .catch((err) => console.error(err))
  }, [])



  // console.log('lists -------- ', plans)

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/episodes/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The episode has been deleted.', 'success').then(() => {
                window.location.reload()
              })
            }
          })
          .catch((err) => {
            // console.error(err)
            Swal.fire('Error', 'Failed to delete the episode', 'error')
          })
      }
    })
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".zip")) {
      setStatus("Please upload a ZIP file.");
      return;
    }

    setStatus("Reading ZIP...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const zip = await JSZip.loadAsync(event.target.result);
        var lt = [];
        const mp4Entries = Object.values(zip.files).filter((file) =>
          file.name.toLowerCase().endsWith(".mp4")
        );

        Object.values(zip.files).map((file) => {
          console.log('file -------------------- ', file)

          var size = (file._data.uncompressedSize / (1024 * 1024)).toFixed(2) + ' MB';


          lt.push({name: file.name, size: size})
        }
        );


        if(lt.length > 0) {
          lt.sort((a, b) => {
            const numA = parseInt(a.name.match(/EP-(\d+)/)[1], 10);
            const numB = parseInt(b.name.match(/EP-(\d+)/)[1], 10);
            return numA - numB;
          });
        }

        setEpisodeList(lt)

        if (mp4Entries.length === 0) {
          setStatus("No .mp4 files found.");
          return;
        }

        setStatus(`Uploading ${mp4Entries.length} .mp4 files...`);

        
        const file = e.target.files[0];
        if (!file || !file.name.endsWith(".zip")) {
          setStatus("Please select a ZIP file.");
          return;
        }

        const formData = new FormData();
        formData.append("series_id", series_id);
        formData.append("zip_file", file);

        setForm(formData)

        setStatus("All .mp4 files set upload!");
      } catch (err) {
        console.error(err);
        setStatus("Error processing ZIP.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  console.log('list --------- ', list)

  const handleUpload = async () => {
    try {
      setStatus("Uploading...");
      const res = await API.post("/episodes/" + series_id, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus(`Upload complete.`);

      Swal.fire('', 'Episode upload complete', 'success').then(function() {
        window.location.reload()
      })

    } catch (err) {
      console.error(err);
      setStatus("Upload failed.");
    }
  }

  console.log('Zip final', mp4Count, error)

  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-header">
            <h2>Upload Episodes</h2>
          </div>
          <div className="card-body">
            <div className="container-fliud">
              <div className="row">
                <div className="col-lg-5">
                  <div className="form-group d-flex justify-content-between">
                    <label>Upload Zip </label>
                    <input type="file" accept=".zip" onChange={(e) => handleFileChange(e)}/> 
                  </div>
                </div>
                <div className="col-lg-12">
                  {
                    list.length > 0 ?
                    <div className="form-group mt-2">
                      <table className='table table-stripped'>
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>File Name</th>
                            <th>File Size</th>
                          </tr>
                        </thead>
                        <tbody>
                          
                            {list.map((elm, ind) => (
                              <tr>
                                <td>{ind+1}</td>
                                <td>{elm.name}</td>
                                <td>{elm.size}</td>
                              </tr>
                            ))}
                          
                        </tbody>
                      </table>
                      
                      {status !='' ? <button type="button" className='btn btn-primary btn-sm' onClick={handleUpload}>Start Uploading Episodes</button> : <></>}
                    </div>  
                    : <></>
                  }
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-body">
            <div className="container-fliud">
              <h2>Episodes</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Display Name</th>
                      <th>Episode</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {episodes.length == 0 ? (
                      <tr>
                        <td colSpan="6">No Record Found...</td>
                      </tr>
                    ) : (
                      episodes.map((item, index) => (
                        <tr key={ item._id }>
                          <td>{ index + 1 }</td>
                          <td>{ item.name }</td>
                          <td>{ item.name }</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item._id)}
                              title="Delete Language"
                            >
                              <CIcon icon={cilTrash} custom="true" className="nav-icon" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-4 detailSection">
          <div className="card-header ">
            <h2>Series Detail</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3">
                <label htmlFor=""> <img src={ series?.thumbnailUrl?.[Object.keys(series?.thumbnailUrl)[0]] } width="200" /> </label>
              </div>
              <div className="col-lg-9">
                <p><span>Name:</span> { series?.title?.[Object.keys(series?.title)[0]] } </p>
                <p><span>Description:</span> { series?.description?.[Object.keys(series?.description)[0]] } </p>
                <p htmlFor=""><span>Release Date:</span> { series?.releaseDate?.split('T')[0] }</p>
                <p htmlFor=""><span>Type:</span> { series?.type }</p>
                <p htmlFor=""><span>Genre:</span> { series?.genres?.join(', ') }</p>
                <p htmlFor=""><span>Views:</span> { series?.views }</p>
              </div>
              <div className="col-lg-9">
              </div>
              <div className="col-lg-9">
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default List
