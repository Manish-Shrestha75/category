import bcrypt from "bcryptjs";
import { User } from "../entities/User.js";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await userRepository.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 12);

    const user = userRepository.create({ 
      name, 
      email, 
      password: hashed,
     
    });
    await userRepository.save(user);

    req.session.user = { 
      id: user.id, 
      name: user.name, 
      email: user.email,
     
    };

    res.status(201).json({ 
      message: "User registered", 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
      
      } 
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
