/**
 * Created by taevis on 12/16/14.
 */
var mongoose = require('mongoose');

var sectionSchema = new mongoose.Schema({
    catalogCode: {type:String, required:true},
    CRN: {type:String, required:true},
    sectionNumber: {type:String, required:true},
    semester:{type:String, required:true},
    instructor:String
});

exports.SectionModel = mongoose.model('Section', sectionSchema);