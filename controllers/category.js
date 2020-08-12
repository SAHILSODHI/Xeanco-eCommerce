const Category = require('../models/category')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: 'category does not exist'
            })
        }
        req.category = category
        next()
    })
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err || !data){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data}) // if key and value are same
    })
}

exports.read = (req, res) => {
    return res.json(req.category)
}

exports.update = (res, req) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.remove = (res, req) => {
    const category = req.category
    category.remove((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message : 'category deleted'
        })
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}
/**
 * query by sell/arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, we return all products
 */