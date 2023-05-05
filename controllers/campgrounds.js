const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render ('campgrounds/index', {campgrounds})
 }

 
 module.exports.newForm=(req,res)=>{
    res.render ('campgrounds/new')
}

module.exports.newCamp = async(req,res,next)=>{
    try{
        //if(!req.body.campground) throw new ExpressError('invalid data', 400),
        // req.files comes from multer
   
   const campground = new Campground (req.body.campground)
   campground.images = req.files.map(f => ({url:f.path, filename:f.filename}))
   campground.author = req.user._id;
   await campground.save();
   req.flash('success','you just made a new campground. YES :)')
   res.redirect(`/campgrounds/${campground._id}`)
    } catch(e){
        next(e)
    }
}

module.exports.showCamp =  async(req,res)=> {
    const {id}= req.params
    const campground = await Campground.findById(id).populate({path:'reviews', populate:{path:'author'}})
    .populate('author')
    if(!campground){
       req.flash('error', 'NO CAMPING :(')
       return res.redirect ('/campgrounds')
   }
    
    res.render('campgrounds/show', {campground})
}

module.exports.editCampForm =  async(req,res)=>{
    const {id}= req.params
    const campground = await Campground.findById(id)
    if(!campground){
       req.flash('error', 'Can not find camp');
       return res.redirect('/campgrounds')
    }
    
    
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCamp =  async(req,res)=>{
    const{id}=req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    const img = req.files.map(f => ({url:f.path, filename:f.filename}))
    campground.images.push(...img)
    await campground.save()
    if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){
           await cloudinary.uploader.destroy(filename)
        }
       await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImage}}}})
    }
    req.flash('success','you just updated)')
   res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCamp = async(req,res)=>{
    const{id}= req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}