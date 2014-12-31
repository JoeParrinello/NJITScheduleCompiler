/**
 * Created by taevis on 12/14/14.
 */
var express = require('express');
var router = express.Router();
var course = require('../models/course');
var section = require('../models/section');


router.get('/', function(req,res) {
    course.CourseModel.find({semester:req.query.term}, function(err, Courses){
       res.send(Courses);
    });
});


router.get('/:catalogCode', function(req, res){
    course.CourseModel.findOne({catalogCode:req.params.catalogCode, semester:req.query.term}, function(err, Course) {
        if(Course){
            var Course = Course.toJSON();
            section.SectionModel.find({catalogCode:req.params.catalogCode, semester:req.query.term}, function(err, Sections) {
                Course.sections = Sections;
                res.send(Course);
            });
        } else {
            res.status(400).send();
        }
    });
});

router.get('/:catalogCode/sections', function(req, res){
   section.SectionModel.find({catalogCode:req.params.catalogCode, semester:req.query.term}, function(err, Sections) {
    res.send(Sections)
   });
});

module.exports = router;
