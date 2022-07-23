
const Product = require('../../../models/product')
const order = require('../../../models/order')

const multer = require('multer')


function manageController() {
    return {
        index(req, res) {
            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
                .populate('customerId', '-password').exec((err, orders) => {
                    if (req.xhr) {

                    } else {
                        res.render('admin/panel');
                    }
                })
        },
        async manage(req, res) {
            const products = await Product.find();
            // console.log(products)
            res.render('admin/manage', { products: products });
        },
        addProcuct(req, res) {
            const { name, description, category, price, rating, stock } = req.body;

            if (!name || !description || !category || !price || !rating || !stock) {
                req.flash('error', 'All fields are required!!');
                return res.redirect('/admin/manage');
            }
            if (!req.file) {
                req.flash('error', 'All fields are required!!');
                return res.redirect('/admin/manage');
            }

            const product = new Product({
                name: name,
                image: req.file.filename,
                description: description,
                category: category,
                price: price,
                rating: rating,
                stock: stock
            });

            product.save().then(() => {
                req.flash('success', 'Product Added Successfully');
                return res.redirect('/admin/manage')
            }).catch(err => {
                req.flash('error', 'Something went wromg');
                return res.redirect('/register');
            });
            console.log(req.body);
        },
        async updateProduct(req, res) {
            const { name, cimage, description, category, price, rating, stock } = req.body;
            var product;


            if (!name || !description || !category || !price || !rating || !stock) {
                req.flash('error', 'All fields are required!!');
                return res.redirect('/admin/manage');
            }
            if (!req.file) {
                product = {
                    name: name,
                    image: cimage,
                    description: description,
                    category: category,
                    price: price,
                    rating: rating,
                    stock: stock
                };
                console.log("File Not Found")
                console.log(req.file)
            } else {
                product = {
                    name: name,
                    image: req.file.filename,
                    description: description,
                    category: category,
                    price: price,
                    rating: rating,
                    stock: stock
                };
                console.log("File  Found")

            }

            let _id = req.params.id;
            if (_id) {
                const result = await Product.findByIdAndUpdate(_id, product);
                req.flash('success', 'Product Updated Successfully');
            } else {
                req.flash('error', 'Product Update failed');
            }
            return res.redirect('/admin/manage');
        },
        async deleteProduct(req, res) {
            let id = req.params.id;
            console.log("id");
            console.log(id)
            if (id) {
                const deleteProduct = await Product.findByIdAndDelete(id);
                req.flash('success', 'Product Deleted Successfully');
                console.log(deleteProduct)
                return res.redirect('/admin/manage');
            } else {
                req.flash('error', 'Product Delete failed');
                return res.redirect('/admin/manage');
            }
        }
        // https://www.djamware.com/post/58b27ce080aca72c54645983/how-to-create-nodejs-expressjs-and-mongodb-crud-web-application

    }
}

module.exports = manageController