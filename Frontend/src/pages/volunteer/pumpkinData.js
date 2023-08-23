import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import styles from "@/styles/data.module.css";
import PumpkinData from "@/components/Pumpkin";
import { supabase } from "supabaseConnection";
import Link from "next/link";

const pumpkinData = () => {
  const router = useRouter();
  const [sstatus, setSStatus] = useState("Error");//db values
  const [sstage, setSStage] = useState("Error");  //db values
  const [stage, setStage] = useState("Error"); //string of stage
  const [status, setStatus] = useState("Error");//string of status
  const [nextStage, setNextStage] = useState("Error"); //button to show

  const endScreen = async () => {
    router.push({
      pathname: "/volunteer/end",
      query: router.query,
    });
  };
  
  function getCurrentFormattedTime() {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
  
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedTime;
  }

  const updateStatus = async () => {
    const time = getCurrentFormattedTime();
    if (sstatus != null) {
      if (sstage == 3) {
        if (status == "Not Started") {
          //start time
          const { data, error } = await supabase
            .from("sstatus")
            .update({ tracing_start: time })
            .eq("sid", sstatus.sid)
            .select();

          console.log(data);
        } else if (!sstatus.tracing_end) {
          const { data, error } = await supabase
            .from("sstatus")
            .update({ tracing_end: time })
            .eq("sid", sstatus.sid)
            .select();
        }
      } else if (sstage == 4) {
        if (status == "Not Started") {
          const { data, error } = await supabase
          .from("sstatus")
          .update({ carving_start: time })
          .eq("sid", sstatus.sid)
          .select();
        } else if (!sstatus.carving_end) {
          const { data, error } = await supabase
            .from("sstatus")
            .update({ carving_end: time })
            .eq("sid", sstatus.sid)
            .select();
        }
      }
      router.push({
        pathname: "/volunteer/end",
        query: router.query,
      });
    }
  };

  async function fetchSStatusData() {
    let { data: sstatus, statusError } = await supabase
      .from('sstatus')
      .select('*')
      .eq('sid', router.query.sid);
    
    console.log(sstatus[0]);
    setSStatus(sstatus[0]);

    let { data: users, stageError } = await supabase
      .from('users')
      .select('stage')
    
    console.log(users[0].stage);
    setSStage(users[0].stage);

    if (stageError || statusError) {
      console.error(error);
      return;
    }
  }

  useEffect(() => {
    fetchSStatusData();
  }, []);

  useEffect(() => {
    // This effect will run whenever sstatus gets updated
    console.log(sstatus);
    console.log(sstage);

    if (sstatus !== null) {
      if(sstage == 1){
        setStage("Printing");
        if(!sstatus.printing){
          setStatus("Not Started");
        }else{
          setStatus("Complete");
        }
      }else if(sstage == 2){
        setStage("Cutting");
        if(!sstatus.cutting){
          setStatus("Not Started");
        }else{
          setStatus("Complete");
        }
      }else if(sstage == 3){
        setStage("Tracing");
        if(!sstatus.tracing_start){
          setStatus("Not Started");
          setNextStage("Start");
        }else if(!sstatus.tracing_end){
          setStatus("In Progress...");
          setNextStage("Finish");
        }else if(!sstatus.tracing_confirmed){
          setStatus("To be Confirmed");
        }else if(sstatus.tracing_confirmed){
          setStatus("Complete");
        }
      }else if(sstage == 4){
        setStage("Carving");
        if(!sstatus.carving_start){
          setStatus("Not Started");
          setNextStage("Start");
        }else if(!sstatus.carving_end){
          setStatus("In Progress...");
          setNextStage("Finish");
        }else if(!sstatus.carving_confirmed){
          setStatus("To be Confirmed");
        }else if(!sstatus.carving_confirmed){
          setStatus("Complete");
        }
      }
    }
  }, [sstatus, sstage]);

  
  let buttons
  if(sstage < 3){
    buttons = <div className={styles.section}>
        <button className={styles.button} 
        onClick={() => {
          router.push("/volunteer/enterID");
        }}>
        Back to Home Page
        </button>
        </div>
  }else if(status == "Not Started"){
    buttons = <div className={styles.section}>
      <button className={styles.button} onClick={updateStatus}>
          {nextStage} {stage}
        </button>
        <button className={styles.back} href="/volunteer/enterID">
        Back to Home Page
        </button>
    </div>
  }
  else if(status == "In Progress..."){
    buttons = <div className={styles.section}>
      <button className={styles.button} onClick={updateStatus}>
          {nextStage} {stage}
        </button>
        <button className={styles.button} onClick={endScreen}>
          I would like to stop early
        </button>
        <button className={styles.back} href="/volunteer/enterID">
        Back to Home Page
        </button>
    </div>
  }else {
      buttons = <div className={styles.section}>
        <Link className={styles.back} href="/volunteer/enterID">
        Back to Home Page
        </Link>
        </div>
  }

  console.log(router.query)

  return (
    <div>
      <div className={styles.section}>
        <PumpkinData
          className={styles.section}
          sid={router.query.sid}
          title={router.query.title}
          category={router.query.cname}
        ></PumpkinData>
      </div>
      <div className={styles.section}>
        <text>Status</text>
        <text className="font-bold text-4xl">{stage}</text>
        <text className="font-grey">{status}</text>
      </div>
      {buttons}
    </div>
  );
};
export default pumpkinData;