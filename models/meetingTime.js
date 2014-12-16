/**
 * Created by taevis on 12/16/14.
 */
var mongoose = require("mongoose");

var meetingTimeSchema = new mongoose.Schema({
    CRN:{type:String, required:true},
    day:{type:String, required:true},
    semester:{type:String, required:true},
    startTime:String,
    endTime:String,
    location:String
});

exports.MeetingTimeModel = mongoose.model('MeetingTime', meetingTimeSchema);