import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // enforce strong password
  },
  role: {
    type: String,
    enum: ["superadmin", "admin"],
    default: "admin",
  },
}, { timestamps: true });


// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12); // stronger hashing
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
AdminSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;