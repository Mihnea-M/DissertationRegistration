import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import styles from "./RegisterPage.module.css";
import AuthContext from "../../providers/AuthProvider";

function RegisterPage() {
  const { register } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    role: "student",
    name: "",
    email: "",
    studentNumber: "",
    department: "",
  });

  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate("/login");
      await register({
        username: formData.username,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        email: formData.email,
        studentNumber:
          formData.role === "student" ? formData.studentNumber : undefined,
        department: formData.department,
      });
      toast.success("Registered successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {formData.role === "student" && (
          <input
            type="text"
            name="studentNumber"
            placeholder="Student Number"
            value={formData.studentNumber}
            onChange={handleChange}
            className={styles.input}
            required
          />
        )}
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
