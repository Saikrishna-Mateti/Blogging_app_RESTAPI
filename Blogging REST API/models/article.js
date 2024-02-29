const mongoose = require('mongoose')
const articleSchema = new mongoose.Schema({

    userName:{
        type: String,
        required: true
    },

    title:{
        type: String,
        required: true
    },

    content:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Article', articleSchema)
