import React from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/AdminNav";
import { supabase } from "./../../../supabaseConnection.js";
import { useState, useEffect } from "react";

export default function Status() {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");
  const [stage, setStage] = useState("");

  useEffect(() => {
    getAdminData();
  }, []);

  async function getAdminData() {
    let { data, error } = await supabase.from("admin_data").select("*");

    if (data.length > 0) {
      setYear(data[0].year);
      setWeek(data[0].week);
      setStage(data[0].stage);
      console.log(data);
    }
  }

  const handleSubmit = async () => {
    let { data, error } = await supabase
      .from("admin_data")
      .update({ year: year, week: week, stage: stage })
      .eq("uid", "admin")
      .select();
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
    console.log(data, error);
>>>>>>> Stashed changes
=======
      console.log(data, error);
>>>>>>> ab5127a4f7eaef1cd61fb64fb3d3a663f9df6230
  };

  return (
    <>
      <Navbar />
      <div className="text-gray-400 bg-gray-800 p-5">
        <div className="mb-5">
          This is the screen for the admin to change the year, week, stage for
          volunteer interface.
        </div>
        <div className="mb-3 text-gray-400">Year</div>
        <input
          className="bg-gray-900 text-gray-400 border border-gray-700 rounded p-2 w-full mb-5"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="year"
        />
<<<<<<< HEAD
<<<<<<< Updated upstream
        <div style={{ color: "#b0b0b0", marginBottom: "10px" }}>Week</div>
        <input
          style={{ backgroundColor: "#282828", color: "#b0b0b0", border: "1px solid #333", borderRadius: "4px", padding: "10px", width: "100%", marginBottom: "20px" }}
          type="number"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          placeholder="week"
        />
        <div style={{ color: "#b0b0b0", marginBottom: "10px" }}>Stage</div>
        <input
          style={{ backgroundColor: "#282828", color: "#b0b0b0", border: "1px solid #333", borderRadius: "4px", padding: "10px", width: "100%", marginBottom: "20px" }}
          type="number"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="stage"
        />
=======
        <div className="mb-3 text-gray-400">Week</div>
        <div className="mb-5 space-x-2">
          {[1, 2, "Both"].map((w) => (
            <button
              key={w}
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                backgroundColor:
                  week == w || (week == "3" && w === "Both")
                    ? "#007bff"
                    : "transparent",
                color:
                  week == w || (week == "3" && w === "Both")
                    ? "#fff"
                    : "#b0b0b0",
                border: "1px solid #333",
                cursor: "pointer",
              }}
              onClick={() => setWeek(w === "Both" ? "3" : String(w))}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="mb-3 text-gray-400">Stage</div>
        <div className="mb-5 space-x-2">
          {["Printing", "Cutting", "Tracing", "Carving"].map((s, index) => (
            <button
              key={s}
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                backgroundColor:
                  stage === String(index + 1) ? "#007bff" : "transparent",
                color: stage === String(index + 1) ? "#fff" : "#b0b0b0",
                border: "1px solid #333",
                cursor: "pointer",
              }}
              onClick={() => setStage(String(index + 1))}
            >
              {s}
            </button>
          ))}
        </div>
>>>>>>> Stashed changes
=======
        <div className="mb-3 text-gray-400">Week</div>
<div className="mb-5 space-x-2">
{[1, 2, "Both"].map((w) => (
    <button
      key={w}
      style={{
        padding: "5px 10px",
        borderRadius: "20px",
        backgroundColor: week == w || (week == "3" && w === "Both") ? "#007bff" : "transparent",
        color: week == w || (week == "3" && w === "Both") ? "#fff" : "#b0b0b0",
        border: "1px solid #333",
        cursor: "pointer",
      }}
      onClick={() => setWeek(w === "Both" ? "3" : String(w))}
    >
      {w}
    </button>
  ))}

</div>
<div className="mb-3 text-gray-400">Stage</div>
<div className="mb-5 space-x-2">
  {["Printing", "Cutting", "Tracing", "Carving"].map((s, index) => (
    <button
      key={s}
      style={{
        padding: "5px 10px",
        borderRadius: "20px",
        backgroundColor: stage === String(index + 1) ? "#007bff" : "transparent",
        color: stage === String(index + 1) ? "#fff" : "#b0b0b0",
        border: "1px solid #333",
        cursor: "pointer",
      }}
      onClick={() => setStage(String(index + 1))}
    >
      {s}
    </button>
  ))}
</div>
>>>>>>> ab5127a4f7eaef1cd61fb64fb3d3a663f9df6230
        <button
          className="bg-blue-600 text-white py-2 px-8 rounded text-lg"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
}
