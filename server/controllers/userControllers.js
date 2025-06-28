import user from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    //check if the email exists from mongo db
    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const fullName = `${firstname} ${lastname}`;
    const newUser = new user({ email, password, name: fullName });
    const token = await newUser.generateAuthToken();
    await newUser.save();
    res.json({ message: "success", token: token });
  } catch (error) {
    console.log(`Error in registering user: `, error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await user.findOne({ email });
    //if user exists
    if (!validUser) {
      return res.status(404).json({ error: "User does not exist" });
    }
    //if its a valid password

    const validPassword = await bcrypt.compare(password, validUser.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await validUser.generateAuthToken();

    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    //httpOnly => //prevents js from accessing the cookie (document.cookie), good security practice, XSS, Site Script attacks
    // maxAge // milliseconds
    //secure , the cookie is sent over HTTPS
    //sameSite:'Strict' => cookie will not be sent with requests related by third party websites
    //CSRF => cross site request forgery
    // www.abc.com
    // <img src = 'https://bank.com/transfer?amount=10000&to=attacker' />

    res.status(200).json({ token, status: 200 });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const validUser = async (req, res) => {
  try {

    const validUser = await user
      .findOne({ _id: req.rootUserId })
      .select("-password");

      console.log('validUser',{validUser})

    if (!validUser) res.json({ error: "User is not valid" });

    res.status(200).json({
      user: validUser,
      token: req.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

export const googleAuth = async (req, res) => {};

export const logout = async (req, res) => {};

export const searchUsers = async (req, res) => {

    try {

        // $or its  a mongo db operator that matches if atleast one condition is true

        //$regex pattern matching similar LIKE in SQL, can perform partial or flexible text searches here

        //{name: {$regex: 'john}}
        //would match ,  john, johnny, john.doe
        //its case sensitve by default


        //$options: 'i' means case - insensitive
                //would match ,  john, johnny, john.doe, JOHN, JoHnny

        // 'm' => multiline matching
        //'x' => ignore whitespaces in regex

        const keyword = req.query.search ? {
            $or: [
                {name: {$regex: req.query.search, $options: 'i'}},
                {email: {$regex: req.query.search, $options: 'i'}},

            ]
        } : {};


        const users = await user.find({
            ...keyword,
            _id: {$ne: req.rootUserId}
        }).select('-password');

        return res.status(200).json({users});
        
    } catch (error) {
        console.log('Search error: ', error);
        return res.status(500).json({error});

    }

};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedUser = await user.findOne({ _id: id }).select("-password");
    res.status(200).json(selectedUser);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  try {
    const updatedUser = await user
      .findByIdAndUpdate(id, { name, bio })
      .select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User info updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error });
  }
};
