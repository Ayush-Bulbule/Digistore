const Order = require('../../../models/order');
const Product = require('../../../models/product');
const moment = require('moment');


function orderControllers() {
    return {
        async store(req, res) {
            const { phone, address } = req.body;

            if (!phone || !address) {
                req.flash('error', 'All fields are required!')
                console.log('All fields required')
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user.id,
                items: req.session.cart.items,
                phone,
                address
            });

            //to dcrease qty from stock
            const keys = Object.keys(order.items);
            const values = Object.values(order.items);
            let qtys = values.map(({ qty }) => qty)

            for (let i = 0; i < keys.length; i++) {
                let product = await Product.findOne({ _id: keys[i] })
                let update = await Product.updateOne({ _id: keys[i] }, { "stock": product.stock - qtys[i] }, { upsert: true })
            }

            order.save().then(result => {
                req.flash('success', 'Order Placed');
                console.log('saved')
                delete req.session.cart
                return res.redirect('/customer/orders');
            }).catch(err => {
                req.flash('error', 'Somethine went wrong');
                console.log(err)
                console.log('All something went wrong');
                return res.redirect('/cart')
            })
            // console.log(req.body);
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, {
                sort: {
                    'createdAt': -1
                }
            });

            res.render('customer/orders', { orders: orders, moment: moment });
            // console.log(orders);
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id);

            //Authorize User
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render("customer/trackOrder", { order: order })
            } else {
                return res.redirect('/');
            }
        }
    }
}

module.exports = orderControllers;