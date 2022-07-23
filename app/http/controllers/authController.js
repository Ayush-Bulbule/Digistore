const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport');

function authController() {

    const _getRedirectUrl = (req)=>{
        return req.user.role === 'admin'?'admin/panel':'/customer/orders'
    }

    return {

        login(req, res) {
            res.render('auth/login');
        },
        postlogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message);
                    return res.redirect('/login');
                }
                if(!user){
                    req.flash('error',info.message);
                    return res.redirect('/login');
                }
                req.login(user,(err)=>{
                    if(err){
                        req.flash('success', info.message);
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req));

                })
            })(req,res,next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postregister(req, res) {
            const { name, email, password } = req.body;

            if (!email || !name || !password) {
                req.flash('error', 'All felds are required!!');

                return res.redirect('/register');
            }

            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already exists');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');

                }
            })

            //Hashing password
            const hashedPassword = await bcrypt.hash(password,10);
            
            //creating user in db
            const user = new User({
                name:name,
                email:email,
                password:hashedPassword
            })

            user.save().then(()=>{
                return res.redirect('/');
            }).catch(err=>{
                req.flash('error','Something went wromg');
                return res.redirect('/register');
            })
            console.log(req.body);
        },

        logout(req, res){
            req.logout();
            return res.redirect('/login')
        }
    }
}


module.exports = authController;
