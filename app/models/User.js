const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import mongoose from 'mongoose';
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: ObjectId,
  username:  String, 
  bio: String,
  
});