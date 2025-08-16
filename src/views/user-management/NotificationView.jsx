import React from 'react'

const NotificationView = () => {
  return (
    <>
        <section className="tableSection">
        <div className="container-fliud">
          <h2>Edit Notification</h2>
          <div className="mainContent">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-4">General Information</h6>
                <form action="">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="" className="mb-2">
                          Title
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="" className="mb-2">
                        Description
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="" className="mb-2">
                          Image
                        </label>
                        <input type="file" className="form-control" />
                      </div>
                    </div>
                    <div className="formSubmitDiv">
                    <button className="btn btn-outline-secondary" type="button">Reset</button>
                    <button className="btn btn-outline-warning active" aria-current="page" type="button">Update</button>

                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default NotificationView
