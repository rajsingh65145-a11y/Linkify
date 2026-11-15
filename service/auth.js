
const jwt=require("jsonwebtoken")

const secret ="harsh%123"; // sambhal ke rakhna hai jwt me isse hi modification kar skate hai

function setUser(user){
    
            return jwt.sign({
                _id:user._id,
                email:user.email,
            },secret);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null; // Agar token invalid/tampered hai to null return karega, crash nahi hoga
    }
}
module.exports={
    setUser,
    getUser
}