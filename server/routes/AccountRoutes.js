const auth = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const View = require('../models/View');
const User = require('../models/User');
const Content = require('../models/Content');
const Subscriber = require('../models/Subscriber');
const { default: sendNotification } = require('../utils/notification');

router.get('/profile', auth, async (req, res) => {

    var user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status:false, message: 'User not found', data:{} });

    res.json({status:true, message: 'User Profile', data:user});
});

router.post('/update-profile', auth, async (req, res) => {

    var user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status:false, message: 'User not found', data:{} });

    const updated_user = await User.findByIdAndUpdate(
        req.user.id, req.body, { new: true }
    );

    res.json({ status:true, message: 'Profile updated success', data:updated_user });
});

router.get('/transactions', auth, async (req, res) => {

    var user = await Subscriber.findOne({user_id: req.user.id}).populate('user_id')
  .populate('plan_id');
    if (!user) return res.status(404).json({ status:false, message: 'User not found', data:{} });

    res.json({ status:true, message: 'Profile updated success', data:user });
});

router.get('/dashboard', async (req, res) => {

    /**
     * Todays User's
     */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysUsers = await User.countDocuments({
        role: "user",
        created_at: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    /**
     * Total Registered User's
     */
    var user = await User.countDocuments({'role':'user'});

    /**
     * Total subscriptions purchased
     */
    var subscribers = await Subscriber.countDocuments();

    /**
     * Total Earnings on Subscriptions
     */
    const result = await Subscriber.aggregate([
        {
            $addFields: {
                amount: { $toDouble: "$amount" }
            }
        },
        {
            $match: {
                status: "active"
            }
        },
        { 
            $group: {
                _id: null,
                totalEarnings: { $sum: "$amount" }
            }
        }
    ]);    
    const earnings = (result[0]?.totalEarnings || 0);

    /**
     * Total Content Upload's
     */
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const liveStreaming = await View.aggregate([
        {
            $match: {
            created_at: { $gte: thirtyMinutesAgo }
            }
        },
        {
            $group: {
            _id: "$user_id" // group by user_id to get unique users
            }
        },
        {
            $count: "uniqueUserCount" // count how many unique user_ids there were
        }
    ]);

    // Extract count or default to 0
    const uniqueCount = liveStreaming[0]?.uniqueUserCount || 0;

    /**
     * Trending Videos
     */
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const trendings = await Content.aggregate([
        { $match: { created_at: { $gte: last7Days } } },
        {
            $addFields: {
            trending_score: {
                $add: [
                { $multiply: ["$views", 0.5] },
                ]
            }
            }
        },
        { $sort: { trending_score: -1 } },
        { $limit: 10 }
    ])
    
    const latest_users = await User.aggregate([
        { $match: { created_at: { $gte: last7Days }, role: "user" } },
        { $sort: { created_at: -1 } },
        { $limit: 10 }
    ])

    /**
     * Total content uploaded
     */
    var contents = await Content.countDocuments();

    let statistics = [{
        user: user.toString(),
        subscribers: subscribers.toString(),
        earnings: `₹${earnings.toFixed(2)}`,
        contents: contents.toString(),
        todaysUsers: todaysUsers.toString(),
        liveStreaming: uniqueCount.toString(),
        trendings:trendings,
        latest_users:latest_users
    }]



    res.json({ status:true, message: 'Dashboard details', data:statistics });
});

// Upload Media
router.post('/upload-media', upload.single('file'), async (req, res) => {
  try {
    // const userId = req.body.userId;
    // const filePath = req.file.path; // 'uploads/filename.png'

    // await User.findByIdAndUpdate(userId, {
    //   profilePicture: filePath
    // });

    res.status(200).json({ message: 'File uploaded successfully', file: process.env.MEDIA_URL + req.file.path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.post('/send-notification', async (req, res) => {
//   try {

//     const tokens = await User.find({ fcm_id: { $ne: null } }).select('fcm_id -_id');
//     const fcmTokens = tokens.map(user => user.fcmToken);


//     // const userId = req.body.userId;
//     // const filePath = req.file.path; // 'uploads/filename.png'

//     // await User.findByIdAndUpdate(userId, {
//     //   profilePicture: filePath
//     // });

//     // sendNotification(req.body.title, req.body.description, fcmTokens, req.body.image)

//     res.status(200).json({ message: 'Notification sent successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;