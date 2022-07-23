const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customer/cartController");
const adminController = require("../app/http/controllers/admin/adminController");
const statusController = require("../app/http/controllers/admin/statusController");

//MiddleWares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const store = require('../app/http/middleware/multeradd')
const admin = require('../app/http/middleware/admin');
const orderControllers = require("../app/http/controllers/customer/orderController");
const manageController = require("../app/http/controllers/admin/manageController");
function initRoutes(app) {

    //home page
    app.get('/', homeController().index);
    app.get('/products/:category', homeController().category);

    //authentication
    //register
    app.get('/register', authController().register);
    app.post('/register', authController().postregister);


    //search 

    app.get('/search', homeController().search)

    //login
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postlogin);

    //logout
    app.post('/logout', auth, authController().logout);


    //cart page
    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);

    //customer
    app.post('/orders', auth, orderControllers().store)
    app.get('/customer/orders', orderControllers().index)
    app.get('/customers/orders/:id', auth, orderControllers().show);


    //admin page
    app.get('/admin/panel', admin, adminController().index);
    app.get('/admin/manage', admin, manageController().manage);
    app.post('/admin/addProcuct', store.single('image'), manageController().addProcuct);
    app.post('/admin/updateProcuct/:id', store.single('uimage'), manageController().updateProduct);
    app.post('/admin/delete/:id', admin, manageController().deleteProduct);

    app.post('/admin/panel/status', admin, statusController().update);

    app.get('*', homeController().error);
}

module.exports = initRoutes;