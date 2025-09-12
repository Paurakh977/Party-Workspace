"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import axios from "axios";
import CreditsChecker from "../Credits/credits-checker";
import NepaliDate from "nepali-datetime";
import Gallery from "../Charts/Gallery";
import PastEvents from "../Tables/PastEvent";
import FutureEvents from "../Tables/FutureEvent";
import PdfDisplayer from "../PDFUploader/pdfDisplayer";
import { 
  Users, 
  MessageSquare, 
  History, 
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const [committeeCount, setCommitteeCount] = useState(0);
  const [subCommitteeCount, setSubCommitteeCount] = useState(0);
  const [smsCount, setSmsCount] = useState(0);
  const userCredit = CreditsChecker();
  const [events, setEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [ueCount, setUeCount] = useState(0);
  const [peCount, setPeCount] = useState(0);

  useEffect(() => {
    const fetchCommitteeCount = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BE_HOST + "/committees/",
        );
        setCommitteeCount(response.data.length);
      } catch (error) {
        console.error("Error fetching committees count:", error);
      }
    };

    const fetchSubCommitteeCount = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BE_HOST + "/sub-committees/",
        );
        setSubCommitteeCount(response.data.length);
      } catch (error) {
        console.error("Error fetching sub-committees count:", error);
      }
    };

    const fetchSmsCount = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BE_HOST + "/messages/",
        );
        setSmsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching SMS count:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BE_HOST + "/events/",
        );
        setEvents(response.data);
        categorizeEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
    fetchCommitteeCount();
    fetchSubCommitteeCount();
    fetchSmsCount();
  }, []);

  const categorizeEvents = (events: any[]) => {
    const now = new NepaliDate();
    const past: any[] = [];
    const upcoming: any[] = [];

    events.forEach((event) => {
      const eventDate = new NepaliDate(event.eventDate);
      if (eventDate.getDate() < now.getDate()) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });
    setPastEvents(past);
    setUpcomingEvents(upcoming);
    setUeCount(upcoming.length);
    setPeCount(past.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div
          onClick={() => {
            window.location.href = "/tables/committeesTable";
          }}
          className="cursor-pointer"
        >
          <CardDataStats
            title="जम्मा समितिहरु"
            total={`${committeeCount}`}
            rate={`${subCommitteeCount} उप-समितिहरु`}
            levelUp
          >
            <Users className="h-6 w-6" />
          </CardDataStats>
        </div>
        
        <div
          onClick={() => {
            window.location.href = "/messages/list";
          }}
          className="cursor-pointer"
        >
          <CardDataStats
            title="पठाइएका सन्देश संख्या"
            total={`${smsCount}`}
            rate={`${userCredit} क्रेडिट बाँकि`}
            levelUp
          >
            <MessageSquare className="h-6 w-6" />
          </CardDataStats>
        </div>
        
        <CardDataStats
          title="बिगतमा भएका कार्यक्रमहरु"
          total={`${peCount}`}
          rate=""
          levelUp
        >
          <History className="h-6 w-6" />
        </CardDataStats>
        
        <CardDataStats
          title="आगामी दिनमा हुने कार्यक्रमहरु"
          total={`${ueCount}`}
          rate=""
          levelDown
        >
          <Calendar className="h-6 w-6" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Gallery />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-6">
          <PastEvents />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <FutureEvents />
        </div>
      </div>
    </>
  );
};

export default ECommerce;