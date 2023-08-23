import { AdminService } from "../service/admin.service.js";
import { Admin } from "../models/admin.model.js";

export const AdminRoute = (app) =>{

    app.post("/api/admin/login", async(req,res)=>{

        try{            
            const {email, password} = req.body
            const accessToken = await AdminService.generateAccessToken(email, password);
            const admin = await Admin.findOne({ email: email });
            console.log("adminiii", admin)
            if (admin && accessToken) {
                res.status(200).send({ token: accessToken });
              } else {
                res.status(404).json({ code:404, message:'Admin not found or access token is invalid' });
              }
          
        }catch(err){
            console.error(err);
            res.status(500).send({code:500, message: err.message})
        }
    })

}

