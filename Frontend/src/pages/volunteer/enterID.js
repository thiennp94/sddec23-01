import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/enterID.module.css";
import { supabase } from "../../../supabaseConnection.js";
import SignInPrompt from "@/components/VolunteerSignInPrompt.js";
import { parse } from "cookie"; // Adjusted import

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState(""); // Add state for error messages
  const [year, setYear] = useState(null);
  const [week, setWeek] = useState(null);
  const [stage, setStage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { data: admin_data, error: adminError } = await supabase
        .from("admin_data")
        .select("*");
      console.log(admin_data[0]);
      setYear(admin_data[0].year);
      setWeek(admin_data[0].week);
      let currentStage = admin_data[0].stage;

      if (currentStage == 1) {
        setStage("printing");
      } else if (currentStage == 2) {
        setStage("cutting");
      } else if (currentStage == 3) {
        setStage("tracing");
      } else if (currentStage == 4) {
        setStage("carving");
      }
    };
    fetchData();
    console.log(year);
    console.log(week);
    console.log(stage);
  }, []);

  const getStencil = async () => {
    const sid = document.getElementById("pid").value;
    console.log(sid);
    console.log(year);
    console.log(week);
    console.log(stage);

    let { data: stencils, error } = await supabase
      .from("sstatus")
      .select("*, stencils(title, extras, category(cname))")
      .eq("sid", sid.toUpperCase())
      .eq("year", year);
    if (week < 3) {
      stencils = stencils.filter((stencil) => stencil.week == week);
    }

    let max = stencils.length;
    let i = 0;

    while (i < max) {
      console.log(stencils[i]);
      if (
        !stencils[i].tracing_start ||
        stencils[i][`${stage}_by`].toLowerCase() ===
          parse(document.cookie).name.toLowerCase()
      ) {
        stencils[i].category = stencils[i].stencils.category.cname;
        stencils[i].title = stencils[i].stencils.title;
        stencils[i].week = stencils[i].week;
        stencils[i].year = stencils[i].year;
        stencils[i].extras = stencils[i].stencils.extras;
        stencils[i].stage = stage;
        stencils[i].name = parse(document.cookie).name;
        const query = stencils[i];
        console.log(query);
        console.log("test");
        router.push({
          pathname: "/volunteer/confirm",
          query: query,
        });
        break;
      }
      i++;
    }
    if (stencils.length == 0) {
      setMessage(
        "Sorry, this stencil seems to have an issue. Please return it to the event staff."
      );
    } else if (i > 0) {
      setMessage(
        "Sorry, this stencil has already been started by another volunteer. Please return it to the event staff."
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getStencil();
    }
  };

  return (
    <SignInPrompt>
      <div className={styles.container}>
        <h1 className={styles.title}>Enter Stencil ID</h1>
        <input
          type="text"
          id="pid"
          name="pid"
          autoComplete="off"
          className={styles.input}
          onKeyDown={handleKeyPress}
        />
        <div>{message}</div>
        <button onClick={getStencil} className={styles.button}>
          Confirm
        </button>
        {stage == "tracing" && (
          <div>You can find the stencil ID in the box on the page</div>
        )}
        {stage == "carving" && (
          <div>You can find the stencil ID on the back of the pumpkin</div>
        )}
      </div>
    </SignInPrompt>
  );
}
