import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Feedback() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setLoading(true);

    try {
      const token = session?.idToken;
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        setMessage("Feedback submitted successfully!");
        setFeedback("");
      } else {
        setMessage("Failed to submit feedback. Try again.");
      }
    } catch (error) {
      setMessage("Error submitting feedback.");
    } finally {
      setLoading(false);
      setFeedback("");
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <div
        className="fixed bottom-6 right-6 flex items-center gap-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          <MessageCircle className="w-5 h-5" />
          {isHovered && (
            <span className="opacity-100 transition-opacity duration-300 text-sm">
              Feedback
            </span>
          )}
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">We value your feedback</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              className="w-full mt-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
              placeholder="Share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              onClick={async () => {
                await handleSubmit();
                setIsOpen(false);
              }}
              className={`mt-4 w-full py-2 rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-400"
              }`}
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
