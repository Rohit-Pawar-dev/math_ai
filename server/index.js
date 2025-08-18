const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path = require('path');
// const logger = require('./logger');

const User = require('./models/User');
const adminRoutes = require("./routes/AdminRoutes");
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');
const accountRoutes = require('./routes/AccountRoutes');
const planRoutes = require('./routes/PlanRoutes');
const pageRoutes = require('./routes/PageRoutes');
const faqRoutes = require('./routes/FaqRoutes');
const genreRoutes = require('./routes/GenreRoutes');
const mediaRoutes = require('./routes/MediaRoutes');
const settingRoutes = require('./routes/SettingRoutes');
const languageRoutes = require('./routes/LanguageRoutes');
const contentLanguageRoutes = require('./routes/ContentLanguageRoutes');
const subscriberRoutes = require('./routes/SubscriberRoutes');
const contentRoutes = require('./routes/ContentRoutes');
const episodeRoutes = require('./routes/EpisodeRoutes');
const bannerRoutes = require('./routes/BannerRoutes');
const viewRoutes = require('./routes/ViewRoutes');
const cointransactionRoutes = require('./routes/CointransactionRoutes');
const homeAppRoutes = require('./routes/HomeAppRoutes');
const reelRoutes = require('./routes/ReelRoutes');
const quizRoutes = require('./routes/QuizRoutes');
const calculatorRoutes = require('./routes/CalculatorRoutes');
const cheatsheetRoutes = require('./routes/CheatsheetRoutes');
const nlogger = require('./logger');

app.use(cors());
// app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  nlogger.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  nlogger.info('Query:' +  JSON.stringify(req.query));
  nlogger.info('Body:' + JSON.stringify(req.body));
  nlogger.info('Headers:' + JSON.stringify(req.headers));
  nlogger.info('-----------------------------------------------------------------------------------------------------------------');
  next();
});


// CRUD OPERATION ROUTES
app.use("/api", adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/page', pageRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/content-languages', contentLanguageRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/series-view', viewRoutes);
app.use('/api/coin-transactions', cointransactionRoutes);
app.use('/api/app-home', homeAppRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/quizes', quizRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/cheat-sheet', cheatsheetRoutes);

// AUTHENTICATION  ROUTES
app.use('/api', accountRoutes);
app.use('/api/auth', authRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

nlogger.info('Hitting socket -------------------- ')

mongoose.connect(process.env.MONGO_URI, { connectTimeoutMS: 30000 }).then(() => {
  console.log('MongoDB connected')
  nlogger.info('New client connected | ')    
}).catch(err => {console.error(err), nlogger.info(err)});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));