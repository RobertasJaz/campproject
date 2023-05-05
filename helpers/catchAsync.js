module.exports = func => {
    return (req,res,next) => {
        func(req,res,next).catch(next)
    }
}

// this is try and catch methods