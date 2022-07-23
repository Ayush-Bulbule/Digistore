
const Order = require('../../../models/order')

function statusController(){
    return {
        update(req, res) {
            Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
                
                if(err){
                    res.redirect('/admin/panel')
                }
                res.redirect('/admin/panel')

            })
        }
    }
}

module.exports = statusController