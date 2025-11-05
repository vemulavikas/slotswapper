import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

export default function Marketplace() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [targetSlot, setTargetSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch all swappable slots from other users
  const fetchSwappable = async () => {
    const res = await api.get("/swappable-slots");
    setSlots(res.data);
  };

  // fetch my own swappable slots
  const fetchMySlots = async () => {
    const res = await api.get("/events");
    const swappable = res.data.filter((ev) => ev.status === "SWAPPABLE");
    setMySlots(swappable);
  };

  useEffect(() => {
    fetchSwappable();
    fetchMySlots();
  }, []);

  const handleSwapRequest = async (theirSlot) => {
    if (mySlots.length === 0) {
      alert("You don’t have any SWAPPABLE slots to offer yet!");
      return;
    }
    setTargetSlot(theirSlot);
  };

  const confirmSwap = async () => {
    if (!selectedOffer || !targetSlot) return;
    setLoading(true);
    await api.post("/swap-request", {
      mySlotId: selectedOffer,
      theirSlotId: targetSlot._id,
    });
    setLoading(false);
    alert("Swap request sent successfully!");
    setTargetSlot(null);
    setSelectedOffer(null);
    fetchSwappable();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <ArrowLeftRight size={24} /> Marketplace
        </h1>
        <div className="flex gap-2">
          <Link
            to="/requests"
            className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
          >
            Requests
          </Link>
          <button
            onClick={fetchSwappable}
            className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6568/6568636.png"
            alt="empty"
            className="w-24 mx-auto mb-4 opacity-80"
          />
          <p>No swappable slots available right now.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">{slot.title || 'Untitled Event'}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(slot.startTime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                By: <strong>{slot.owner?.name || 'Unknown'}</strong>
              </p>

              <button
                onClick={() => handleSwapRequest(slot)}
                className="mt-3 bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                Request Swap
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for choosing own slot */}
      {targetSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-2 text-center text-indigo-700">
              Offer a Slot in Exchange
            </h2>
            <p className="text-gray-600 text-sm mb-4 text-center">
              You’re requesting: <strong>{targetSlot?.title || 'Unknown Event'}</strong> <br />
              Choose one of your own SWAPPABLE slots to offer:
            </p>

            {mySlots.length === 0 ? (
              <p className="text-center text-gray-500">No swappable slots yet.</p>
            ) : (
              <select
                value={selectedOffer || ""}
                onChange={(e) => setSelectedOffer(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your slot...</option>
                {mySlots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.title || 'Untitled'} ({new Date(slot.startTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })})
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setTargetSlot(null);
                  setSelectedOffer(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwap}
                disabled={!selectedOffer || loading}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 text-sm"
              >
                {loading ? "Sending..." : "Confirm Swap"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
