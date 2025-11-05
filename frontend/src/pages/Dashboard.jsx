import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, RefreshCw, Trash2, Repeat, LogOut } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    setRefreshing(true);
    const res = await api.get("/events");
    setEvents(res.data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEvent = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startTime || !form.endTime) return;
    setLoading(true);
    await api.post("/events", form);
    setForm({ title: "", startTime: "", endTime: "" });
    setLoading(false);
    fetchEvents();
  };

  const toggleSwappable = async (id, currentStatus) => {
    const newStatus = currentStatus === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
    await api.patch(`/events/${id}`, { status: newStatus });
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm p-4 rounded-xl flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">📅 My Events - Welcome, {user?.name}</h1>
        <div className="flex gap-2">
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200"
          >
            Marketplace
          </Link>
          <Link
            to="/requests"
            className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
          >
            Requests
          </Link>
          <button
            onClick={fetchEvents}
            className="flex items-center gap-2 text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Add Event Form */}
      <form
        onSubmit={addEvent}
        className="bg-white shadow-md p-4 rounded-xl grid sm:grid-cols-4 gap-3 mb-8"
      >
        <input
          type="text"
          name="title"
          placeholder="Event title"
          value={form.title}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          <PlusCircle size={18} />
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
            alt="No events"
            className="w-24 mb-4 opacity-80"
          />
          <p className="text-lg">No events yet! Add one above.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">{event.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(event.startTime)} → {formatDate(event.endTime)}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === "SWAPPABLE"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => toggleSwappable(event._id, event.status)}
                  className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg ${
                    event.status === "SWAPPABLE"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <Repeat size={14} />
                  {event.status === "SWAPPABLE" ? "Mark Busy" : "Make Swappable"}
                </button>

                <button
                  onClick={() => deleteEvent(event._id)}
                  className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
