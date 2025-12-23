import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Load contacts
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts");
      setContacts(res.data);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  // Validate email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.email.trim()) newErrors.email = "Email required";
    else if (!isValidEmail(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone required";
    if (!form.message.trim()) newErrors.message = "Message required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/contacts", form);
      setContacts([res.data, ...contacts]);
      setForm({ name: "", email: "", phone: "", message: "" });
      setSuccess("Contact added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      alert("Error adding contact");
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (window.confirm("Delete this contact?")) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        setContacts(contacts.filter((c) => c._id !== id));
        setSuccess("Contact deleted!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        alert("Error deleting contact");
      }
    }
  };

  return (
    <div className="app">
      <h1>Contact Manager</h1>
      {success && <div className="success">{success}</div>}

      <div className="container">
        {/* Form */}
        <div className="card">
          <h2>Add Contact</h2>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {errors.message && <p className="error">{errors.message}</p>}

          <button onClick={handleSubmit}>Submit Contact</button>
        </div>

        {/* Contact List */}
        <div className="card">
          <h2>Contacts ({contacts.length})</h2>
          <div className="contacts-list">
            {contacts.length === 0 ? (
              <p className="no-contacts">
                No contacts yet! Add your first contact.
              </p>
            ) : (
              contacts.map((c) => (
                <div key={c._id} className="contact">
                  <h3>{c.name}</h3>
                  <p>{c.email}</p>
                  <p>{c.phone}</p>
                  <p>{c.message}</p>
                  <button
                    onClick={() => deleteContact(c._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
