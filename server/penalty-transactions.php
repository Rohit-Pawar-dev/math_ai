<style type="text/css">
   .mt-2{
      margin-top: 4px;
   }
   .d-flex .controls, .d-flex fieldset {
      margin-right: 10px;
   }
   .logoimg{
      height: 154px;
      width: 150px;
   }
   .logoimg img{
   	position: relative;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
   }
   .mt-10{
      margin-top: 10%;
   }
</style>
<?php include "includes/admin_header.php";  ?>
<script src="<?php echo base_url();?>assets/jquery-timepicker-min.js"></script>
<div class="page-wrapper">
<!-- ============================================================== -->
<!-- Bread crumb and right sidebar toggle -->
<!-- ============================================================== -->
<div class="row page-titles">
   <div class="col-md-5 align-self-center">
      <h3 class="text-themecolor">Penalty Settings</h3>
   </div>
   <div class="col-md-7 align-self-center">
      <ol class="breadcrumb">
         <li class="breadcrumb-item"><a href="<?php echo base_url();?>admin/dashboard">Home</a></li>
         <li class="breadcrumb-item active">Penalty Settings</li>
      </ol>
   </div>
   <div class="">
      <button class="right-side-toggle waves-effect waves-light btn-inverse btn btn-circle btn-sm pull-right m-l-10"><i class="ti-settings text-white"></i></button>
   </div>
</div>
<!-- ============================================================== -->
<!-- End Bread crumb and right sidebar toggle -->
<!-- ============================================================== -->
<!-- ============================================================== -->
<!-- Container fluid  -->
<!-- ============================================================== -->
<div class="container-fluid">
   <!-- ============================================================== -->
   <!-- Start Page Content -->
   <!-- ============================================================== -->
   <div class="row">
      <div class="box-header with-border">
         <h3 class="box-title"></h3>
         <div class="promo-add"></div>
      </div>
      <!-- /.box-header -->
      <div class="col-md-12">
         <div class="card">
            <div class="card-body">
               <!-- -->
               <?php  if(($this->session->flashdata('item'))) {
                  $message = $this->session->flashdata('item');  ?>
                  <div class="alert alert-<?php echo $message['class'];?>"><?php echo $message['message']; ?></div>

               <?php   } ?>       
               <form action="<?= base_url('admin/update_penalty_setting') ?>" method="post" id="penalty-setting">
                  <div class="row">
                     <div class="col-lg-12">
                        <table class="table table-stripped">
                           <tbody>
                              <tr>
                                 <td>Penalty on Bad Review</td>
                                 <td><input type="number" class="form-control" name="bad_review" value="<?= $settings['bad_review']??'' ?>"></td>
                              </tr>
                              <tr>
                                 <td>Penalty for not assign Driver / Vehicle in booking 30 MIN before Pickup time</td>
                                 <td><input type="number" class="form-control" name="late_assign" value="<?= $settings['late_assign']??'' ?>"></td>
                              </tr>
                              <tr>
                                 <td>Penalty for Not using Driver application</td>
                                 <td><input type="number" class="form-control" name="not_using_driver_app" value="<?= $settings['not_using_driver_app']??'' ?>"></td>
                              </tr>
                              <tr>
                                 <td>Penalty for Late Reached pickup</td>
                                 <td><input type="number" class="form-control" name="late_reached_pickup" value="<?= $settings['late_reached_pickup']??'' ?>"></td>
                              </tr>
                              <tr>
                                 <td>Reward for 5 Start Rating</td>
                                 <td><input type="number" class="form-control" name="good_review" value="<?= $settings['good_review']??'' ?>"></td>
                              </tr>
                           </tbody>
                           <tfoot>
                              <tr>
                                 <th colspan="4">
                                    <button type="submit" class="btn btn-primary btn-sm" >Save</button>
                                 </th>
                              </tr>
                           </tfoot>
                        </table>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>
</div>
<?php  include "includes/admin-footer.php";  ?>
<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
   $(document).on('submit', '#penalty-setting', function(e) {
      e.preventDefault()

      var form = new FormData(this)

      $.ajax({
         type: "POST",
         url: $(this).attr('action'),
         data: form,
         dataType: "json",
         cache: false,
         contentType: false,
         processData: false,
         success: function (response) {
            if(response.status) {
               Swal.fire('', `${response.message}`, 'success').then(function() {
                  window.location.reload()
               })
            }
         }
      });

   })
</script>