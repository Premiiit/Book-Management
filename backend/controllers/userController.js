const User = require('../models/User');

// @desc Get user profile
// @route GET /users/:id
// @access Private (User or Admin)
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update user profile
// @route PUT /users/:id
// @access Private (User or Admin)
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // Will be hashed in schema
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc Create a new admin
// @route POST /api/users/admin
// @access Private (Admin only)
exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if requester is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only admins can create new admins.' });
    }

    // Check if admin already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the new admin
    const newAdmin = await User.create({
      name,
      email,
      password,
      isAdmin: true,
    });

    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      isAdmin: newAdmin.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

