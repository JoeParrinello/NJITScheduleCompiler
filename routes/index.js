var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mainApp = require('../app.js');
var courses = require('../models/courses');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/scrape', function(req,res){
  var termJson = "";//'201510';
  if (req.query.term){
    //TODO Regex to determine if query string is valid.
    termJson = req.query.term;
  } else {
    termJson = courses.currentSemester;
  }
  console.log(termJson);


  console.log("Dropping All Collections...");
  courses.CourseModel.remove({semester:termJson}, function(err){
    console.log(err);
    console.log("Dropped Course Collection...");
    courses.SectionModel.remove({semester:termJson}, function(err){
      console.log(err);
      console.log("Dropped Section Collection...");
      courses.MeetingTimeModel.remove({semester:termJson}, function(err){
        console.log(err);
        console.log("Dropped MeetingTime Collection...");
        console.log("Dropping All Collections Complete.");
      });
    });
  });




  res.set('Content-Type','text/html');
  console.log(mainApp.scraperSemaphore);
  if(mainApp.scraperSemaphore){
    res.send("<h1>Scrape Initialized Elsewhere!</h1>");
  } else {
    mainApp.scraperSemaphore = true;
    console.log("scraping");
    request.post({url:"https://bnssbpr1.njit.edu/prod/bwckgens.p_proc_term_date", form:{p_calling_proc:"bwckschd.p_disp_dyn_sched", p_term:termJson}}, function(error, response, html) {
      //console.log(html);
      var $ = cheerio.load(html);
      var subjValues = [];
      $('#subj_id').children().each(function (i, elem) {
        subjValues.push(elem.attribs.value);
      });
      console.log('eachSubValue');
      async.mapSeries(subjValues, function (item, callback) {
        res.write(item+": ");
        var sendObj = [];
        var formData = "term_in=" + termJson + "&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=" + item + "&sel_crse=&sel_title=&sel_from_cred=&sel_to_cred=&sel_levl=%25&sel_ptrm=%25&sel_instr=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a";
        var contentLength = formData.length;

        request({
          headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          uri: "https://bnssbpr1.njit.edu/prod/bwckschd.p_get_crse_unsec",
          body: formData,
          method: 'POST'
        }, function (err, resp, html2) {
          var $ = cheerio.load(html2);
          //noinspection JSJQueryEfficiency
          var ddTitleLength = $('.ddtitle').length;
          res.write(" Pulled; Processing "+ddTitleLength+" Classes: ");
          //noinspection JSJQueryEfficiency
          $('.ddtitle').map(function (i) { //removed ,elem)
            var str = $(this).text();
            var splitStr = str.split(" - ");
            if(splitStr[1].toUpperCase()=="HONORS"){
              sendObj.push({title: splitStr[0], CRN: splitStr[2], catalogCode: splitStr[3], section: splitStr[4]});
            } else {
              sendObj.push({title: splitStr[0], CRN: splitStr[1], catalogCode: splitStr[2], section: splitStr[3]});
            }
            var credits = $(this).parent().next("tr").children("td").html();
            var creditRegex = /<br>\n.*(\d\.\d+)/g;
            sendObj[i].credits = creditRegex.exec(credits)[1];
            var timeSelector = $(this).parent().next("tr").children("td").children("table .datadisplaytable").children("tr");
            sendObj[i].objects = [];
            //1-100 Scaling, sorry for the long ifs, to check for the right size.
            if(i==Math.floor(ddTitleLength/10)){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*2){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*3){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*4){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*5){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*6){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*7){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*8){
              res.write("|");
            }
            if(i==Math.floor(ddTitleLength/10)*9){
              res.write("|");
            }
            timeSelector.each(function(j){ //removed ,elem)
              if(j!=0){
                for(k = 0; k <$(this).children().first().next().next().text().length; k++){
                  sendObj[i].objects.push({});
                  sendObj[i].objects[sendObj[i].objects.length-1].day = $(this).children().first().next().next().text()==" " ? "Online" : $(this).children().first().next().next().text().charAt(k);
                  if(sendObj[i].objects[sendObj[i].objects.length-1].day!="Online") {
                    var time = $(this).children().first().next().text().split(" - ");
                    sendObj[i].objects[sendObj[i].objects.length-1].startTime = time[0];
                    sendObj[i].objects[sendObj[i].objects.length-1].endTime = time[1];
                    sendObj[i].objects[sendObj[i].objects.length-1].where = $(this).children().first().next().next().next().text();
                  }
                  sendObj[i].objects[sendObj[i].objects.length-1].instructor = $(this).children().first().next().next().next().next().next().next().text();
                  if(k == $(this).children().first().next().next().text().length-1 && i==$('.ddtitle').length-1 && j==timeSelector.length-1){
                    res.write(" Done<br>");
                    callback(false, sendObj);
                  }
                }

              }
            });
          });
        });
      }, function (err, results) {
        res.write("<br><h2>Done Writing!</h2>");
        res.end();
        console.log("Done Scraping!");
        mainApp.scraperSemaphore = false;
        var ArrayOfAllClasses = [];
        results.forEach(function(item){
          item.forEach(function(classItem){
            ArrayOfAllClasses.push(classItem);
            //console.log(classItem.catalogCode +" - " + classItem.title +" - " +classItem.CRN);
          });
        });
        //console.log(ArrayOfAllClasses);
        async.eachSeries(ArrayOfAllClasses, function(item, callback){
          courses.CourseModel.findOne({catalogCode:item.catalogCode, semester:termJson}, function(err, Course){
            if(!Course){
              var newCourse = new courses.CourseModel({catalogCode:item.catalogCode, title:item.title, credits: item.credits, semester:termJson});
              newCourse.save(function(err, courseProduct){
                var newSection = new courses.SectionModel({catalogCode:courseProduct.catalogCode, CRN:item.CRN, sectionNumber:item.section, semester:termJson});
                newSection.save(function(err, sectionProduct){
                  async.eachSeries(item.objects, function(meetingTimeItem, sectionCallback){
                    var newMeetingTime = new courses.MeetingTimeModel({CRN:sectionProduct.CRN, day: meetingTimeItem.day, semester:termJson, startTime:meetingTimeItem.startTime, endTime:meetingTimeItem.endTime, location:meetingTimeItem.location});
                    newMeetingTime.save(function(err){
                      if(err){
                        sectionCallback(err);
                      } else {
                        sectionCallback();
                      }
                    });
                  }, function(err){
                    if(err) {
                      console.log(err);
                      callback(err);
                    } else {
                      callback();
                    }
                  });
                });
              });
            } else {
              var newSection = new courses.SectionModel({catalogCode:item.catalogCode, CRN:item.CRN, sectionNumber:item.section, semester:termJson});
              newSection.save(function(err, sectionProduct){
                async.eachSeries(item.objects, function(meetingTimeItem, sectionCallback){
                  var newMeetingTime = new courses.MeetingTimeModel({CRN:sectionProduct.CRN, day: meetingTimeItem.day, semester:termJson, startTime:meetingTimeItem.startTime, endTime:meetingTimeItem.endTime, location:meetingTimeItem.location});
                  newMeetingTime.save(function(err){
                    if(err){
                      sectionCallback(err);
                    } else {
                      sectionCallback();
                    }
                  });
                }, function(err){
                  if(err) {
                    console.log(err);
                    callback(err);
                  } else {
                    callback();
                  }
                });
              });
            }
          });
        }, function(err){
          if(err) {
            console.log(err);
          }
          console.log("Done Storing in MongoDB");
          courses.findCurrentSemester();
        });
      });
    });
  }

});

module.exports = router;
