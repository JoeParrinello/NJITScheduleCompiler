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

exports.CourseModel = mongoose.model('Course', courseSchema);

exports.findCurrentSemester = function(){
    this.CourseModel.where({}).sort("-semester").findOne(function(err, Course){
        if(err){
            console.log(err);
        } else if (!Course) {
            console.log("There are no Courses in the DB that are being returned!");
        }else{
            exports.currentSemester=Course.semester;
            console.log("Set Current Semester As "+Course.semester);
        }
    });
};