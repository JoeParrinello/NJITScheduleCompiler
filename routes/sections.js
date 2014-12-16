/**
 * Created by taevis on 12/16/14.
 */
var express = require('express');
var router = express.Router();
var course = require('../models/course');
var section = require('../models/section');
var meetingTime = require('../models/meetingTime');


router.get('/', function(req,res) {
    section.SectionModel.find({semester:req.query.term}, function(err, Sections){
        res.send(Sections);
    });
});


router.get('/:CRN', function(req, res){
    section.SectionModel.findOne({CRN:req.params.CRN, semester:req.query.term}, function(err, Section) {
        res.send(Section)
    });
});

router.get('/:CRN/meetingtimes', function(req, res){
    meetingTime.MeetingTimeModel.find({CRN:req.params.CRN, semester:req.query.term}, function(err, MeetingTimes) {
        res.send(MeetingTimes)
    });
});

router.get('/:CRN/course', function(req, res){
    section.SectionModel.findOne({CRN:req.params.CRN, semester:req.query.term}, function(err, Section) {
        course.CourseModel.findOne({catalogCode:Section.catalogCode, semester:Section.semester}, function(err, Course){
            res.send(Course);
        });
    });
});

module.exports = router;