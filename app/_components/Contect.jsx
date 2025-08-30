"use client";
import { db } from "@/utils/db";
import { Newsletter } from "@/utils/schema";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

const Contect = () => {
  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(name, email, message);

    if (name && email && message) {
      setLoading(true);
      try {
        const resp = await db.insert(Newsletter).values({
          newName: name,
          newEmail: email,
          newMessage: message,
          createdAt: moment().format("YYYY-MM-DD"),
        });

        if (resp) {
          toast("User Response recorded successfully");
          setName("");
          setEmail("");
          setMessage("");
        } else {
          toast("Error recording response");
        }
      } catch (error) {
        console.error(error);
        toast("Error recording response");
      } finally {
        setLoading(false);
      }
    } else {
      toast("No data entered");
    }
  };
  return (
    <div className="container mx-auto text-center max-w-4xl">
      <div className="mb-16">
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
          📧 Contact Us
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Get In
          <span className="block text-blue-600">Touch</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have any questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-left">
                Full Name
              </label>
          <input
            type="text"
                placeholder="Enter your full name"
            value={name}
            onChange={handleInputChange(setName)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
          />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-left">
                Email Address
              </label>
          <input
            type="email"
                placeholder="Enter your email address"
            value={email}
            onChange={handleInputChange(setEmail)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
          />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-left">
              Message
            </label>
          <textarea
              placeholder="Tell us how we can help you..."
            value={message}
            onChange={handleInputChange(setMessage)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
              rows="5"
          />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoaderCircle className="animate-spin w-5 h-5" />
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Send Message</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contect;
