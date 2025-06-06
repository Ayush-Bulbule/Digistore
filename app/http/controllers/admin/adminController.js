

const User = require('../../../models/user')
const order = require('../../../models/order')

function adminController() {
    return {
        index(req, res) {
            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
                .populate('customerId', '-password').exec((err, orders) => {
                    if(req.xhr){
                        return res.json(orders);
                    }else{
                        res.render('admin/panel');
                    }
            })
        }
    }
}

module.exports = adminController