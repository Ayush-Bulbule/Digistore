const Product = require('../../models/product');

function homeController() {
    return {
        async index(req, res) {
            const products = await Product.find();
            // console.log(products)
            res.render('home', { products: products });
        },
        async category(req, res) {
            console.log(req.params.category)
            const products = await Product.find({ category: req.params.category }, null);
            console.log("called category")
            console.log(products);
            if (products.length > 0) {
                req.flash('success', ` ${req.params.category}`)
            } else {
                req.flash('success', `No products found for: ${req.params.category}`)
            }
            console.log(products)
            res.render('home', { products: products });
            // res.status(404).send('Not Found')
        },
        error(req, res) {
            res.render("404error", {
                errorMsg: 'Opps! Page Not Found'
            })
            res.status('404');

        },
        async search(req, res) {
            var regex = new RegExp(req.query.searchitem, 'i');
            try {
                const products = await Product.find({ $or: [{ name: regex }, { category: regex }, { description: regex }] }, (err, products) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (products.length > 0) {
                            req.flash('success', `Search Results for: ${req.query.searchitem}`)
                        } else {
                            req.flash('success', `No products found for: ${req.query.searchitem}`)
                        }
                        console.log(products)
                        res.render('home', { products: products });
                    }
                })
            } catch (error) {
                console.log(error);
            }

        }
    }
}

module.exports = homeController;