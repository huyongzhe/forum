var express = require('express')
var Users = require('./mongodb')
var md5 = require('blueimp-md5')
const session = require('express-session')
var router = express.Router()
router.get('/', function (req, res) {
    console.log(req.session.users)
    res.render('index.html',{
        users: req.session.users
    })
})

router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res) {
    Users.findOne({
        email: req.body.email,
        password: md5(md5(req.body.password))
    }, function(err, user) {
        if (err) {
            return res.status(200).json({
                err_code: 500,
                message: 'Server error.'
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or password error.'
            })
        }
        req.session.users = user
        if (user) {
            return res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })
        }
    })
})  
router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register',function (req, res) {
    // try{
    //     if (await User.findOne({email: req.body.email})) {
    //         return res.status(500).json({
    //             err_code: 1,
    //             message: 'Internal error.'
    //         })
    //     }
    //     if (await User.findOne({name: req.body.name})) {
    //         return res.status(500).json({
    //             err_code: 1,
    //             message: 'Internal error.'
    //         })
    //     }
    //     // 对密码进行 md5 重复加密
    //     req.body.password = md5(md5(req.body.password))
    //     await new User(req.body).save(function (err, user) {
    //         res.status(200).json({
    //             err_code: 0,
    //             message: 'OK'
    //         })
    //         req.session.user = user
    //         req.session.isLogin = true
    //     })
    // } catch (err) {
    //         return res.status(400).json({
    //         err_code: 500,
    //         message: 'Internal error.'
    //     })
    // }
    // // 因为返回到ajax是异步,所以重定向无效
    // // 因为对异步无效 
    // // res.redirect('/')

        // Express 提供了一个响应方法:json
// 改方法接收一个对象作为参数,
// 它会自动帮你把对象转为字符串再发送给浏览器
// console.log(req.body)
Users.findOne({
    $or: [{
        email: req.body.email
    },{
        name: req.body.name
    }]
},function (err, data) {
    if (err) {
        return res.status(500).json({
            err_code: 500,
            message: 'Internal error.'
        })
    }
    if (data) {
        return res.status(200).json({
            err_code: 1,
            message: 'email or name aleady exists.'
        })
    }
    // 对密码进行 md5 重复加密
    req.body.password = md5(md5(req.body.password))
        new Users(req.body).save(function (err, user) {
            if (err) {
                return res.status(400).json({
                    err_code: 500,
                    message: 'Internal error.'
                })
            }
            req.session.users = user
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })
})

router.get('/logout', function (req, res) {
    req.session.user = null
    res.redirect('/login')
})

router.get('/settings/profile', function (req, res) {
    res.render('settings/profile.html')
})

router.get('/admin', function (req, res) {
    res.render('settings/admin.html')
})
module.exports = router