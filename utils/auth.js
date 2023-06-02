const withAuth = (req, res, next) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        next();
    }
    };
    
    // This is middleware to check if a user is logged in
    // If a user is not logged in, redirect to the login page
    // If a user is logged in, continue with the request to the restricted route

module.exports = withAuth;