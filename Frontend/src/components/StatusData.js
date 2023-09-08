import React, { useEffect } from "react";
import { supabase } from "./../../supabaseConnection.js";
import { useState } from "react";

const StatusData = ({
  year,
  week,
  stage,
  isConfirmed,
  notConfirmed,
  notStarted,
  inProgress,
  completed,
  searchTerm,
}) => {
  const [data, setData] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const successStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    background: "rgba(0, 128, 0, 0.7)" /* Use rgba to set transparency */,
    color: "#fff",
    padding: "10px",
    alignItems: "center",
    z: 9999 /* Ensure it appears on top of everything */,
  };

  const buttonStyle = {
    backgroundColor: "green",
    width: "24px",
    height: "24px",
    border: "none",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    fontSize: "16px",
  };
  const buttonStyle2 = {
    backgroundColor: "red",
    width: "24px",
    height: "24px",
    border: "none",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    fontSize: "16px",
  };

  useEffect(() => {
    if (year !== null && loading) {
      getData();
    }
  }, [year]);

  const getData = async () => {
    console.log("Getting data");
    setLoading(true);
    try {
      const { data: sstatusData, error } = await supabase
        .from("sstatus")
        .select("*, stencils(title)");

      sstatusData.sort((a, b) => {
        const sidA = a.sid.split("-").map(Number);
        const sidB = b.sid.split("-").map(Number);

        for (let i = 0; i < Math.max(sidA.length, sidB.length); i++) {
          const diff = (sidA[i] || 0) - (sidB[i] || 0);
          if (diff !== 0) {
            return diff;
          }
        }

        return 0;
      });
      console.log(sstatusData);

      setData(sstatusData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (item, field, value) => {
    console.log(item, field, value);
    try {
      const updateObject = { [field]: value };
      const { data: updatedData, error } = await supabase
        .from("sstatus")
        .update(updateObject)
        .eq("sid", item.sid)
        .eq("year", item.year)
        .eq("week", item.week)
        .select("*, stencils(title)");
      console.log(error);

      console.log(updatedData);
      if (!error) {
        setSuccessMessage("Entry updated successfully");

        // Create a new copy of the data array and update the relevant item
        setData((prevData) => {
          const newData = [...prevData];
          const itemIndex = newData.findIndex((el) => el.sid === item.sid);
          if (itemIndex !== -1) {
            newData[itemIndex] = updatedData[0];
          }
          return newData;
        });
      } else {
        // Handle error as needed
      }
    } catch (error) {
      console.error("Error updating data:", error);
      // Handle error as needed
    }

    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  const stageMappings = {
    1: {
      header:
        week === "Both"
          ? ["SID", "Week", "Title", "Printing"]
          : ["SID", "Title", "Printing"],
      render: (item) =>
        (item.sid.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm === "") &&
        (item.week === week || week === "Both") &&
        ((!item.printing && notStarted) || (item.printing && completed)) ? (
          <>
            <td style={tableCellStyle}>{item.sid}</td>
            <td style={tableCellStyle}>{item.week}</td>
            <td style={tableCellStyle}>{item.stencils.title}</td>
            <td style={tableCellStyle}>
              {item.printing ? "Complete" : "Incomplete"}
              <button
                style={buttonStyle}
                onClick={() => handleEdit(item, "printing", 1)}
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "printing", 0)}
              >
                X
              </button>
            </td>
          </>
        ) : (
          <></>
        ),
    },
    2: {
      header:
        week === "Both"
          ? ["SID", "Week", "Title", "Cutting"]
          : ["SID", "Title", "Cutting"],
      render: (item) =>
        (item.sid.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm === "") &&
        (item.week === week || week === "Both") &&
        ((!item.cutting && notStarted) || (item.cutting && completed)) ? (
          <>
            <td style={tableCellStyle}>{item.sid}</td>
            <td style={tableCellStyle}>{item.week}</td>
            <td style={tableCellStyle}>{item.stencils.title}</td>
            <td style={tableCellStyle}>
              {item.cutting ? "Complete" : "Incomplete"}
              <button
                style={buttonStyle}
                onClick={() => handleEdit(item, "cutting", 1)}
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "cutting", 0)}
              >
                X
              </button>
            </td>
          </>
        ) : (
          <></>
        ),
    },
    3: {
      header:
        week === "Both"
          ? [
              "SID",
              "Week",
              "Title",
              "Tracing Start",
              "Tracing End",
              "tracing_by",
              "Confirm?",
            ]
          : [
              "SID",
              "Title",
              "Tracing Start",
              "Tracing End",
              "tracing_by",
              "Confirm?",
            ],

      render: (item) =>
        (item.sid.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm === "" ||
          item.tracer?.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm === "") &&
        (item.week === week || week === "Both") &&
        ((!item.tracing_start && notStarted) ||
          (!item.tracing_end && inProgress && item.tracing_start) ||
          (item.tracing_end && completed)) &&
        ((item.tracing_confirmed && isConfirmed) ||
          (!item.tracing_confirmed && notConfirmed)) ? (
          <>
            <td style={tableCellStyle}>{item.sid}</td>
            <td style={tableCellStyle}>{item.week}</td>
            <td style={tableCellStyle}>{item.stencils.title}</td>
            <td style={tableCellStyle}>
              <input
                type="datetime-local"
                value={item.tracing_start || ""}
                onChange={(e) =>
                  handleEdit(item, "tracing_start", e.target.value)
                }
              ></input>
              <button
                style={buttonStyle}
                onClick={() =>
                  handleEdit(item, "tracing_start", currentDate.toISOString())
                }
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "tracing_start", null)}
              >
                X
              </button>
            </td>
            <td style={tableCellStyle}>
              <input
                type="datetime-local"
                value={item.tracing_end || ""}
                onChange={(e) =>
                  handleEdit(item, "tracing_end", e.target.value)
                }
              ></input>
              <button
                style={buttonStyle}
                onClick={() =>
                  handleEdit(item, "tracing_end", currentDate.toISOString())
                }
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "tracing_end", null)}
              >
                X
              </button>
            </td>
            <td style={tableCellStyle}>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission behavior
                  handleEdit(
                    item,
                    "tracing_by",
                    document.getElementById(
                      `tracing_by_${item.sid}_${item.index}`
                    ).value
                  ); // Call your edit handler when the form is submitted
                }}
              >
                <input
                  id={`tracing_by_${item.sid}_${item.index}`}
                  type="text"
                  placeholder={"No Tracer Assigned"}
                  defaultValue={item.tracer}
                />
                <button
                  type="submit" // Specify the button type as "submit"
                  style={buttonStyle}
                >
                  ✓
                </button>
                <button
                  style={buttonStyle2}
                  onClick={() => {
                    handleEdit(item, "tracing_by", null);
                    document.getElementById(
                      `tracing_by_${item.sid}_${item.index}`
                    ).value = null;
                  }}
                >
                  X
                </button>
              </form>
            </td>
            <td style={tableCellStyle}>
              {item.tracing_confirmed ? "Confirmed" : "Not Confirmed"}
              <button
                style={buttonStyle}
                onClick={() =>
                  handleEdit(
                    item,
                    "tracing_confirmed",
                    currentDate.toISOString()
                  )
                }
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "tracing_confirmed", null)}
              >
                X
              </button>
            </td>
          </>
        ) : (
          <></>
        ),
    },
    4: {
      header:
        week === "Both"
          ? [
              "SID",
              "Week",
              "Title",
              "Carving Start",
              "Carving End",
              "carving_by",
              "Confirm?",
            ]
          : [
              "SID",
              "Title",
              "Carving Start",
              "Carving End",
              "carving_by",
              "Confirm?",
            ],

      render: (item) =>
        (item.sid.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm === "" ||
          item.carving_by?.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm === "") &&
        (item.week === week || week === "Both") &&
        ((!item.carving_start && notStarted) ||
          (!item.carving_end && inProgress && item.carving_start) ||
          (item.carving_end && completed)) &&
        ((item.carving_confirmed && isConfirmed) ||
          (!item.carving_confirmed && notConfirmed)) ? (
          <>
            <td style={tableCellStyle}>{item.sid}</td>
            <td style={tableCellStyle}>{item.week}</td>
            <td style={tableCellStyle}>{item.stencils.title}</td>
            <td style={tableCellStyle}>
              <input
                type="datetime-local"
                value={item.carving_start || ""}
                onChange={(e) =>
                  handleEdit(item, "carving_start", e.target.value)
                }
              ></input>
              <button
                style={buttonStyle}
                onClick={() =>
                  handleEdit(item, "carving_start", currentDate.toISOString())
                }
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "carving_start", null)}
              >
                X
              </button>
            </td>
            <td style={tableCellStyle}>
              <input
                type="datetime-local"
                value={item.carving_end || ""}
                onChange={(e) =>
                  handleEdit(item, "carving_end", e.target.value)
                }
              ></input>
              <button
                style={buttonStyle}
                onClick={() =>
                  handleEdit(item, "carving_end", currentDate.toISOString())
                }
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "carving_end", null)}
              >
                X
              </button>
            </td>
            <td style={tableCellStyle}>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission behavior
                  handleEdit(
                    item,
                    "carving_by",
                    document.getElementById(
                      `carving_by_${item.sid}_${item.index}`
                    ).value
                  ); // Call your edit handler when the form is submitted
                }}
              >
                <input
                  id={`carving_by_${item.sid}_${item.index}`}
                  type="text"
                  placeholder={"No Carver Assigned"}
                  defaultValue={item.carving_by}
                />
                <button
                  type="submit" // Specify the button type as "submit"
                  style={buttonStyle}
                >
                  ✓
                </button>
                <button
                  style={buttonStyle2}
                  onClick={() => {
                    handleEdit(item, "carving_by", null);
                    document.getElementById(
                      `carving_by_${item.sid}_${item.index}`
                    ).value = null;
                  }}
                >
                  X
                </button>
              </form>
            </td>
            <td style={tableCellStyle}>
              {item.carving_confirmed ? "Confirmed" : "Not Confirmed"}
              <button
                style={buttonStyle}
                onClick={() =>
                  handleEdit(
                    item,
                    "carving_confirmed",
                    currentDate.toISOString()
                  )
                }
              >
                ✓
              </button>
              <button
                style={buttonStyle2}
                onClick={() => handleEdit(item, "carving_confirmed", null)}
              >
                X
              </button>
            </td>
          </>
        ) : (
          <></>
        ),
    },
  };

  const currentDate = new Date();
  const stageMapping = stageMappings[stage];

  return (
    <div>
      {successMessage && <div style={successStyle}>{successMessage}</div>}

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          {stageMapping && (
            <>
              <thead>
                <tr>
                  {stageMapping.header.map((headerText, index) => (
                    <th key={index} style={tableHeaderStyle}>
                      {headerText}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, rowIndex) => (
                  <tr key={`stencil_${item.sid}_${item.week}_${item.year}`}>
                    {stageMapping.render(item)}
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      )}
    </div>
  );
};

const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  fontWeight: "bold",
  textAlign: "center",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

export default StatusData;
