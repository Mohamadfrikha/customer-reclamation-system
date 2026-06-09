import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactezNous() {

  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div data-theme="silk" className="min-h-screen bg-white py-16 px-4">

      {/* Title */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-extrabold text-base-content mb-3">
          Contactez-nous
        </h1>
        <p className="text-base-content/70">
          Nous sommes disponibles pour répondre à toutes vos questions
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-base-200 p-8 rounded-3xl shadow-lg flex flex-col justify-center gap-6">

          <div className="flex items-center gap-4">
            <MapPin className="text-primary" />
            <span>Sfax, Tunisie</span>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="text-primary" />
            <span>+216 99 999 999</span>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="text-primary" />
            <span>contact@hospital.tn</span>
          </div>

        </div>

        {/* Form */}
        <div className="bg-base-200 p-8 rounded-3xl shadow-lg">

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="nom"
              placeholder="Votre nom"
              className="input input-bordered w-full"
              value={form.nom}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Votre email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="sujet"
              placeholder="Sujet"
              className="input input-bordered w-full"
              value={form.sujet}
              onChange={handleChange}
            />

            <textarea
              name="message"
              rows="5"
              placeholder="Votre message..."
              className="textarea textarea-bordered w-full"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button className="btn btn-primary w-full flex gap-2">
              <Send size={18} />
              Envoyer
            </button>

          </form>
        </div>

        {/* Info */}
        

      </div>

    </div>
  );
}
