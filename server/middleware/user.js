import user from "../models/userModel.js";
import jwt from 'jsonwebtoken';

export const Auth = async (req, res, next) => {
    try {

            let token = req.headers.authorization;
            //cases google login and normal login
            if(token.length < 500){
                const verifiedUser = jwt.verify(token, process.env.SECRET);

                const rootUser = await user.findOne({_id:verifiedUser.id }).select('-password');


                req.token = token;
                req.rootUser = rootUser;
                req.rootUserId = rootUser._id;


            }else{

            }


        next();
        
    } catch (error) {
        
        res.json({error: 'Invalid Token'});
    }

}