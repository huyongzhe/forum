const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/forum', {useNewUrlParser: true, useUnifiedTopology: true});

var Schema = mongoose.Schema
const userSchema = new Schema({ 
    email: {
        type: String,
        required: true
    },
    name: { 
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    date_time: {
        type: Date,
        default: Date.now
    },
    last_time: {
        type: Date,
        default: Date.now
    },
    photo: {
        type: String,
        default: '/public/img/avatar-default.png'
    },
    recommend: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1]
    },
    status: {
        type: Number,
        // 0 代表没有限制
        // 1 代表能不能评论
        // 2 代表能不能登录
        enum: [0, 1, 2]
    }
});

// 集合的名字一定是大写的集合单数
module.exports = mongoose.model('User', userSchema)