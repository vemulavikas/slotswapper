import { useEffect, useState } from "react";
import api from "../api/api";
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    setRefreshing(true);
    const res = await api.get("/events"); // get my events just to recheck states later
    // get all swap requests (filter by me)
    const allReq = await api.get("/swap-requests"); // optional endpoint, if not built we’ll mock below
    setIncoming(allReq.data.incoming);
    setOutgoing(allReq.data.outgoing);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const respondToSwap = async (requestId, accept) => {
    await api.post(`/swap-response/${requestId}`, { accept });
    fetchRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">� Swap Requests</h1>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Incoming */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3 text-indigo-700">
            Incoming Requests
          </h2>
          {incoming.length === 0 ? (
            <p className="text-gray-500 text-sm">No incoming requests.</p>
          ) : (
            incoming.map((req) => (
              <div
                key={req._id}
                className="border-b border-gray-200 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="text-sm text-gray-700">
                  <p>
                    <strong>{req.requester?.name}</strong> wants to swap their{" "}
                    <span className="font-medium text-indigo-600">
                      {req.mySlot?.title || 'Unknown Event'}
                    </span>{" "}
                    with your{" "}
                    <span className="font-medium text-indigo-600">
                      {req.theirSlot?.title || 'Unknown Event'}
                    </span>
                    .
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {req.status}
                  </p>
                </div>

                {req.status === "PENDING" && req.mySlot && req.theirSlot && (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => respondToSwap(req._id, true)}
                      className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 text-sm"
                    >
                      <CheckCircle size={14} /> Accept
                    </button>
                    <button
                      onClick={() => respondToSwap(req._id, false)}
                      className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 text-sm"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Outgoing */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3 text-indigo-700">
            Outgoing Requests
          </h2>
          {outgoing.length === 0 ? (
            <p className="text-gray-500 text-sm">No outgoing requests.</p>
          ) : (
            outgoing.map((req) => (
              <div
                key={req._id}
                className="border-b border-gray-200 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="text-sm text-gray-700">
                  <p>
                    You requested{" "}
                    <span className="font-medium text-indigo-600">
                      {req.theirSlot?.title || 'Unknown Event'}
                    </span>{" "}
                    from{" "}
                    <strong>{req.responder?.name}</strong> in exchange for your{" "}
                    <span className="font-medium text-indigo-600">
                      {req.mySlot?.title || 'Unknown Event'}
                    </span>
                    .
                  </p>
                  <p className="text-xs text-gray-500">
                    Status:{" "}
                    {req.status === "PENDING" ? (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <Clock size={12} /> Pending
                      </span>
                    ) : req.status === "ACCEPTED" ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} /> Accepted
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={12} /> Rejected
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
