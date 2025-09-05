const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Email field is required'],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile field is required'],
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    dob: {
      type: Date,
      // required: true
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'employee', 'admin', 'teacher'],
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    otp: {
      type: String,
      required: true,
      default: '0000',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'english',
    },
    referralCode: {
      type: String,
      default: '',
    },
    referredBy: {
      type: String,
      default: '',
    },
    subscription: {
      planId: { type: Schema.Types.ObjectId, ref: 'Plan', default: null },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      isAutoRenew: { type: Boolean, default: 0 },
    },
    coins: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'blocked'],
    },
    fcm_id: {
      type: String,
      default: '',
    },
    classStandard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },
    gaurdian_type: {
      type: String,
      default: 'father',
    },
    gaurdian_name: {
      type: String,
    },
    gaurdian_country_code: {
      type: String,
    },
    gaurdian_mobile: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

module.exports = mongoose.model('User', userSchema)
