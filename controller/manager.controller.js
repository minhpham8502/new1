const CourseModel = require('../models/course')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
var fileModel = require('../models/file')
var DashboardtModel = require('../models/Dashboard')
var saltRounds = 10;
class manageController {

    settime(req, res, next) {
        let date = req.body.date;
        let time = req.body.time;
        //thời gian ban đầu
        let deadline1 = date + " " + time;

        var someDate = new Date(date);
        someDate.setDate(someDate.getDate() + 14);
        var dateFormated = someDate.toISOString().substr(0, 10);
        //thời gian sau khi cộng 14 ngày
        let deadline2 = dateFormated + " " + time;
        CourseModel.updateMany({}, { deadline: deadline1, deadline2: deadline2 }, function (err, data) {
            if (err) {
                res.json("")
            }
            CourseModel.find({}, function (err, data) {
                if (err) {
                    res.json("")
                }
                res.json(data)
            })
        })

    }

    //hiển thị tất cả các khoa
    allfaculity(req, res) {
        CourseModel.find({})
            .then(data => {
                res.render('./marketingmanager/allfaculity', { course: data })
            })
            .catch(err => {
                res.json("loi sever")
            })
    }

    //hiển thị tất cả bài viết của khoa đã chọn
    allcontribution(req, res) {
        let slug = req.params.slug;
        fileModel.find({ slug: slug }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                res.render('marketingmanager/allcontribution', { data: result })
            }
        })
    }
    // xem thong ke
    allstatistical = async (req, res) => {
        let cout = 0;
        AccountModel.find({ slug: req.params.slug, role: "student" })
            .then(data => {
                console.log("sohocsinhcuakhoa", data.length)
                DashboardtModel.findOneAndUpdate({ slug: req.params.slug }, { hocsinhcuakhoa: data.length }, function (err, data) {
                    if (err) {
                        res.json("loivl")
                    }
                })

                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i].email)
                    fileModel.find({
                        slug: req.params.slug,
                        studentemail: data[i].email
                    }).then(data2 => {
                        cout = cout + 1;
                        DashboardtModel.findOneAndUpdate({ slug: req.params.slug }, { soHocsinhnopbai: cout }, function (err, data) {
                        })
                    })
                }
            })

        fileModel.find({ slug: req.params.slug }, function (data) { })
            .then(data => {
                fileModel.find({
                    status: "pass"
                })
                    .then(data1 => {
                        let Tongsobaidanop = data.length
                        let sobaidapass = data1.length
                        console.log("Tongsobaidanop", Tongsobaidanop)
                        console.log("sobaidapass", sobaidapass)
                        DashboardtModel.findOneAndUpdate({ slug: req.params.slug }, { tongbaidanop: Tongsobaidanop, sobaidapass: sobaidapass }, function (err, data) {
                        })
                    })
            })
        DashboardtModel.find({ slug: req.params.slug }, function (err, data) {
            console.log("dấdasds", data)
            res.render('marketingmanager/thongke', { data: data })

        })
    }


    //đọc bài viết vừa chọn
    readcontribution(req, res) {
        let id = req.params.id
        fileModel.find({ _id: id }, (err, data) => {
            if (err) {
                console.log(err)
            } else if (data.length > 0) {
                res.render('marketingmanager/readcontribution', { data: data })
            } else {
                res.render('guest/readcontribution', { data: data })
            }
        })
    }

    allcoursemanager(req, res) {
        CourseModel.find({})
            .then(data => {
                res.render('./marketingmanager/allcoursemanager', { course: data })
            })
            .catch(err => {
                res.json("loi sever")
            })
    }

    // allstatistical = async (req,res)=>{
    //     AccountModel.findById({_id : "60503607b8ce7e2b080906a3"}).then((data)=>{
    //         console.log(data.fileSubmit.length)
    //         console.log("================")
    //     }
    // )}
    addManager (req,res){
        AccountModel.find(function(err,data){
            res.render('./marketingmanager/addManager')    
    })
    }

    allManager (req,res){
        AccountModel.find({role : "manager"},function(err,data){
            res.render('./marketingmanager/allManager',{account:data})    
    })
    }
    
    doAddManager(req,res){
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;
            
            
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const hash = bcrypt.hashSync(password, salt);
                    let newManager = AccountModel({
                        username,
                        password :hash,
                        email,
                        role :"manager"
                    })
                    newManager.save(function(err,data){
                        if(err){
                            console.log(err)
                        }else{
                            
                            res.redirect('/manage/allManager/')
                        }
                    })
    }
    
    updateManager(req,res){
        AccountModel.findById(req.params.id)
            .then(data=>
                res.render('marketingmanager/updateManager',{account:data})
            )
    }
    deleteManager (req,res){
        
            AccountModel.deleteOne({
                _id :  req.params.id
            })
            .then(()=>{
                res.redirect('/manage/allManager/')
            })
        
        
        
    }
    doupdateManager (req,res){
        AccountModel.updateOne({
            _id : req.params.id
        }, req.body)
        .then(()=>{
            res.redirect('/manage/allManager/')
        })
    }
}
module.exports = new manageController;