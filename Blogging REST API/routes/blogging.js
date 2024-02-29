const express = require('express')
const routes = express.Router()
const Article = require('../models/article')

// Getting an endpoint to Add new blog post

routes.post('/posts', async (req, res) => {

    const post = new Article({
        userName: req.body.userName,
        title: req.body.title,
        content: req.body.content
    })
    try{

        const savedArticle = await post.save();
        res.status(201).json(savedArticle)

    }catch(err){

        res.status(400).send(err)
    }


})

// Getting an endpoint to Retrieve all blog post

routes.get('/posts', async (req,res) => {

    try{

        const posts = await Article.find()
        res.json(posts)

    }catch (err) {

        res.status(500).json(err)

    }
   

})

// Getting an endpoint to Retrieve all blog post by given username

routes.get('/posts/user/:userName', async (req,res) => {

    try{

        const posts = await Article.find({userName: req.params.userName})
        res.json(posts)

    }catch(err){

        res.status(500).json(err)


    }
})

// Getting an endpoint to Retrieve all blog posts by containing a given word (searchWord) in the title

routes.get('/posts/title/:searchWord', async (req,res) => {

    const searchWord = req.params.searchWord;
    try{

        const posts = await Article.find({ title:{ $regex: searchWord, $option: 'i' } })
        res.json(posts)

    }catch(err){

        res.status(500).json(err)

    }
})

// Getting an endpoint to  Retrieve all blog posts containing a given word in the content

routes.get('/posts/contain/:searchWord', async (req,res) => {

    const searchWord = req.params.searchWord

    try{

        const posts = await Article.find({ content: { $regex: searchWord, $option: 'i'}})
        res.json(posts)

    }catch(err){

        res.status(500).json(err)
    }

})

// Getting an endpointt to Delete all blogs by a given username.

routes.delete('/posts/user/:userName', async (req,res) => {

    const userName = req.params.userName
    try{

        const result = await Article.deleteMany({userName: userName})
        if(result.deletedCount === 0){
            return res.status(404).send('No post were found for given username')
        }

        res.send('Successfully deleted ${result.deletedCount} posts by ${userName}.')

    }catch (err){
        console.log(err);
        res.status(500).send('Failure to delete the post')
    }


})

// Getting an endpoint to Delete all blogs that contain a certain word (searchWord)

routes.delete('/posts/content/:searchWord', async (req,res) => {

    const searchWord = req.params.searchWord

    try{

        const result = await Article.deleteMany({ content: { $regex: searchWord, $option: 'i'}})
        if(result.deletedCount === 0){

            return res.status(404).send('No post were found for certain word')

        }
        res.send('Successfully deleted ${result.deletedCount} posts containing "${searchWord}" in their content.')

    }catch(err){

        console.log(err)
        res.status(500).send('Failure to delete the post')
    } 
})

// Getting an endpoint that returns the userName and the number of blogs posted by a userName

routes.get('/posts/count/:userName', async (req,res) => {

    const userName = req.params.userName
    
    try{
        const result = await Article.aggregate([
        { $match: { userName: userName } },
        { $group: { id: "$userName", totalPosts: { $sum: 1 } } }
    ])

    if (result.length === 0) {
        return res.status(404).send("No posts found for the given user.");
    }

    const response = {
        userName: result[0].id,
        totalPosts: result[0].totalPosts
    };
  
    res.json(response);
  
    }catch(err){
        console.log(err);
        res.status(500).send("Failed to fetch post count.");
    }
})



module.exports = routes