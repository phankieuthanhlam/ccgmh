var appendLocalsToUseInViews = function(req, res, next)
{            
    //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.session = req.session;
    next(null, req, res);
}
module.exports =  appendLocalsToUseInViews;