const Banner = require("../../models/Banner");
const MEDIA_URL = process.env.MEDIA_URL;

exports.getBanners = async (req, res) => {
    try {
        const searchText = req.query.search ?? '';
        const limit = parseInt(req.query.limit) || 10; // Default limit if not provided
        const offset = parseInt(req.query.offset) || 0;

        // Query to fetch only active banners
        const query = { status: 'active' };

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
            message: 'Active banners fetched successfully',
            data,
            total,
            limit,
            offset,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Error fetching active banners:', err);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
