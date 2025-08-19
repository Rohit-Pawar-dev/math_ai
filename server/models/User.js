const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Email field is required'],
    unique: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile field is required'],
    unique: true,
    minlength: 10,
    maxlength: 10
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'employee', 'admin', 'teacher']
  },
  otp: {
    type: String,
    required: true,
    default: '0000',
  },
  profilePicture: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'english'
  },
  interests: {
    type: Array,
    default: []
  },
  referralCode: {
    type: String,
    default: ''
  },
  referredBy: {
    type: String,
    default: ''
  },
  watchlist: {
    type: [Schema.Types.ObjectId],
    ref: 'Content',
    default: []
  },
  history: [{
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content'
    },
    watchedTill: {
      type: Number,
      default: 0
    },
    watchedOn: {
      type: Date,
      default: Date.now
    }
  }],
  subscription: {
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isAutoRenew: { type: Boolean, default: 0 }
  },
  downloads: {
    type: [Schema.Types.ObjectId],
    ref: 'Content',
    default: []
  },
  coins: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'blocked']
  },
  fcm_id: {
    type: String,
    default: ''
  },
  // classStandard: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Class",
  //     required: [true, "Class standard is required"],
  //   },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// 🔐 Hash password before saving (Create)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if changed
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Hash password before updating (Update)
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  update.updated_at = new Date(); // just in case timestamps miss this
  this.setUpdate(update);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
