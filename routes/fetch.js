/**
 * Created by taevis on 12/14/14.
 */
var express = require('express');
var router = express.Router();
var courses = require('../models/courses');

router.get('/courses', function(req,res) {
    courses.CourseModel.find({}, function(err, Courses){
       res.send(Courses);
    });
});


router.get('/courses/:catCode', function(req, res){
    courses.CourseModel.findOne({catalogCode:req.params.catCode}, function(err, Course) {
        res.send(Course)
    });
});

router.get('/courses/:catCode/sections', function(req, res){
   courses.SectionModel.find({catalogCode:req.params.catCode}, function(err, Sections) {
    res.send(Sections)
   });
});

module.exports = router;
