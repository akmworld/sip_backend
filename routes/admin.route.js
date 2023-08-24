import { AdminService } from "../service/admin.service.js";
import { Admin } from "../models/admin.model.js";

export const AdminRoute = (app) =>{

    app.post("/api/admin/login", async(req,res)=>{

        try{            
            const {email, password, persist} = req.body
            const accessToken = await AdminService.generateAccessToken(email, password, persist);
            const admin = await Admin.findOne({ email: email });
            console.log("administrator", admin)
            if (admin && accessToken) {
                res.status(200).send({code:200, message:"Login Successfully", token: accessToken });
              } else {
                res.status(404).json({ code:404, message:'Admin not found or access token is invalid' });
              }
            console.log({token:accessToken})
        }
        catch(err)
        {
            console.error(err);
            res.status(500).send({code:500, message: err.message})
        }
    })

    app.get("/api/admin/users", async (req, res) => {
        try {
          const users = await AdminService.getAllUsers();
          res.json(users);
        } catch (e) {
          console.error(e); 
          res.status(500).json({ message: e.message });
        }
      });

    app.put('/api/admin/update-user', async (req, res) => {
        try {
            const updatedUser = await AdminService.updateUser(req.params.email, req.body);
            res.status(200).send({ code: 200, message: 'User updated successfully!', user: updatedUser });
        } catch (e) {
            console.error(e);
            res.status(500).send({ code:  500, message: e.message  });
        }
    });


    app.delete('/api/admin/delete-user',async(req,res)=>{
        const userData = req.body;
        try{
            console.log("Received User Data For Delete : ", userData);
            const deleted = await AdminService.deleteUser(userData)
            if(deleted)
            {
                res.status(200).send({code:200, message:'User Delete Successfully'});
            }
            else
            {
                res.status(500).send({code:500, message:"Failed To Delete User"})
            }
           }
        catch(e)
            {
                res.status(500).send({code: e.code, message: e.message})
            }
        
    })

}
    




