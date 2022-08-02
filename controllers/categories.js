const { categoriesModel, validateCat } = require("../models/categoriesSchema");

exports.getCategories = async (req, res) => {
    try {
        let categories = await categoriesModel.find({})
        res.status(200).json(categories)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.srchCategories = async (req, res) => {
    let idSrch = req.params.idSrch
    try {
        let category = await categoriesModel.findOne({ _id: idSrch })
        if (category)
            res.status(200).json(category)
        else
            res.status(200).json("not found")
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.addCategories = async (req, res) => {
    try {
        let validate = validateCat(req.body);
        if (validate.error)
            return res.status(400).json(validate.error.details)
        let exist = await categoriesModel.findOne({ category: req.body.category })
        if (exist)
            return res.status(409).json({ mgs: "the category exist already" })

        let categories = await categoriesModel.create(req.body)
        await categories.save();
        console.log(categories)
        res.status(201).json(categories)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.delCategory = async (req, res) => {
    let idDel = req.params.idDel
    try {
        let data = await categoriesModel.deleteOne({ _id: idDel })
        res.status(200).json(data)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

}