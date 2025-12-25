const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    return res.render('user/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            return res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    return res.render('user/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'Goodbye!');
        return res.redirect('/campgrounds');
    });
};