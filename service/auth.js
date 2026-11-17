
const jwt=require("jsonwebtoken")

const secret ="harsh%123"; // sambhal ke rakhna hai jwt me isse hi modification kar skate hai

function setUser(user){
    
            return jwt.sign({    
                _id:user._id,
                email:user.email,
                role:user.role || "NORMAL",
            },secret);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);  // agar  token aur cookie me uid hai to jwt verify karega ki token aur secret me match karega
    } catch (error) {
        return null; // Agar token invalid/tampered hai to null return karega, crash nahi hoga
    }
}
module.exports={
    setUser,
    getUser
}