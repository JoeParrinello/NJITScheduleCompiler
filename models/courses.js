/**
 * Created by taevis on 12/14/14.
 */
var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    catalogCode: {type:String, required:true},
    title:{type:String, required:true},
    semester:{type:String, required:true},
    credits:{type:String, require:true}
});

var sectionSchema = new mongoose.Schema({
    catalogCode: {type:String, required:true},
    CRN: {type:String, required:true},
    sectionNumber: {type:String, required:true},
    semester:{type:String, required:true},
    instructor:String
});

var meetingTimeSchema = new mongoose.Schema({
    CRN:{type:String, required:true},
    day:{type:String, required:true},
    semester:{type:String, required:true},
    startTime:String,
    endTime:String,
    location:String
});

exports.CourseModel = mongoose.model('Course', courseSchema);
exports.SectionModel = mongoose.model('Section', sectionSchema);
exports.MeetingTimeModel = mongoose.model('MeetingTime', meetingTimeSchema);

exports.findCurrentSemester = function(){
    this.CourseModel.where({}).sort("-semester").findOne(function(err, Course){
        if(err){
            console.log(err);
        } else {
            exports.currentSemester=Course.semester;
            console.log("Set Current Semester As "+Course.semester);
        }
    });
};