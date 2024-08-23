const jwt = require("jsonwebtoken")
const User = require("../models/user")



module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    User.findOne({ _id: userId })
    .then((user) => {
       if (!user) {
          return res.status(401).json({ message: "login ou mot de passe incorrecte " });
       } else {
          req.auth = {
             userId: userId,
             role: user.role,
          };
          next();
       }
    })
    .catch((error) => {
       res.status(500).json({ error: error.message });
    });
 
  } catch (error) {
    res.status(401).json({ error });
  }
};
  
module.exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    // Vérifie le rôle de l'utilisateur 
    const userRole = User.find(user => user.equals(userId));
    if (!userRole ||  userRole.role !== "Admin"  ) {
      return res.status(403).json({ error: "Vous n'avez pas les autorisations requises pour cette action. Il faut etre Admin" });
    }

    // Si l'utilisateur a le rôle d'admin, passe à la prochaine étape du middleware
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};