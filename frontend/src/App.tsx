import { useState } from "react";
import { FlowView } from "./FlowView";

type FlowResult = {
  nodes: { id: string; label: string }[];
  edges: { from: string; to: string; type: "structure" | "flow" }[];
};
function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}
function App() {
  const [flow, setFlow] = useState<FlowResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setisAuth] = useState(false);
  const [error, setError] = useState("");

  const startCrawl = async () => {
    if (!isValidURL(inputUrl)) {
      setError("Please enter valid url");
      return;
    }
    if (!isValidEmail(email) && isAuth) {
      setError("Please enter valid email");
      return;
    }
    setLoading(true);
    try {
      setError("");
      const res = await fetch("http://localhost:5000/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startUrl: inputUrl, // from user
          maxDepth: 2,
          maxPages: 50,
          auth: isAuth
            ? {
                email: email,
                password: password,
              }
            : undefined,
        }),
      });
      console.log(res);
      const data = await res.json();
      if (!res.ok || res.status !== 200) {
        setError("Something occurred please try again");
        return;
      }
      setFlow(data);
      console.log(data);
    } catch (err) {
      setError("Something occurred please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex h-screen bg-neutral-100">
        <aside
          className={`
            top-0
            overflow-auto
             backdrop-blur-3xl
            shadow-[1px_0px_0px_#37352f17]
            bg-neutral-100 
            z-40
            p-2
            max-w-60
          `}
        >
          <input
            id=""
            className="
          w-full rounded px-2 py-1 text-xs 
          bg-[#E6E6E6]
          focus:outline-none focus:ring-1 focus:ring-[#68A3FF]
          mb-2
        "
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <button
            onClick={startCrawl}
            disabled={loading}
            className="bg-blue-600 w-full text-white mb-2"
          >
            {loading ? "Crawling…" : "Start Crawl"}
          </button>
          <div className="text-[10px] font-medium text-[#91918e] mb-2 flex justify-between items-center">
            <span>Authenticated Access(Optional)</span>
            <button
              onClick={() => setisAuth((prev) => !prev)}
              className="cursor-pointer"
            >
              ^
            </button>
          </div>
          {isAuth && (
            <>
              <input
                id=""
                className="
              w-full rounded px-2 py-1 text-xs 
              bg-[#E6E6E6]
              focus:outline-none focus:ring-1 focus:ring-[#68A3FF]
              mb-2
            "
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <input
                id=""
                className="
                w-full rounded px-2 py-1 text-xs 
                bg-[#E6E6E6]
                focus:outline-none focus:ring-1 focus:ring-[#68A3FF]
              "
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </aside>

        {flow && <FlowView nodes={flow.nodes} edges={flow.edges} />}
      </div>
    </div>
  );
}
export default App;
