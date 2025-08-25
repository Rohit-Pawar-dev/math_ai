const Banner = require('../../models/Banner');
const getCustomMulter = require('../../utils/customMulter');
const upload = getCustomMulter('banners');
const MEDIA_URL = process.env.MEDIA_URL;

// Create Banner
exports.createBanner = async (req, res) => {
  try {
    const { title, status } = req.body;

    const banner = await Banner.create({
      title,
      status,
      image: req.file ? `/uploads/banners/${req.file.filename}` : '',
    });

    res.status(201).json({
      status: true,
      message: 'Banner created successfully',
      data: banner,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Get All Banners
exports.getBanners = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0;

    const query = {};
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' };
    }

    const total = await Banner.countDocuments(query);
    const banners = await Banner.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 });

    const data = banners.map((banner) => ({
      ...banner.toObject(),
      image: banner.image ? `${MEDIA_URL}${banner.image}` : null,
    }));

    res.json({
      status: true,
      message: 'Banners fetched successfully',
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Get Single Banner
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner)
      return res
        .status(404)
        .json({ status: false, message: 'Banner not found' });

    const data = {
      ...banner.toObject(),
      image: banner.image ? `${MEDIA_URL}${banner.image}` : null,
    };

    res.json({
      status: true,
      message: 'Banner fetched successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, status } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res
        .status(404)
        .json({ status: false, message: 'Banner not found' });
    }

    banner.title = title || banner.title;
    banner.status = status || banner.status;

    if (req.file) {
      banner.image = `/uploads/banners/${req.file.filename}`;
    }

    await banner.save();

    res.json({
      status: true,
      message: 'Banner updated successfully',
      data: banner,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: 'Internal server error', error: err.message });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

exports.uploadBannerImage = upload.single('image');
