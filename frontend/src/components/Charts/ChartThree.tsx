import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

interface Event {
  eventId: number;
  eventHeading: string;
  eventDetails: string;
  eventDate: string;
  eventTime: string;
  address: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  venue: string;
  eventOrganizer: string;
  remarks: string;
}

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0); // Store totalEvents in state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/events/`,
        );

        const provinceData = response.data; // This is an array of event objects

        // Create a mapping of province to count of events
        const provinceCount: Record<string, number> = provinceData.reduce(
          (acc: Record<string, number>, event: Event) => {
            if (event.province) {
              acc[event.province] = (acc[event.province] || 0) + 1; // Count occurrences of each province
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        // Convert the province count into two arrays for series and labels
        const values = Object.values(provinceCount); // Count of events per province
        const names = Object.keys(provinceCount); // Names of provinces

        setSeries(values);
        setLabels(names);
        setTotalEvents(values.reduce((sum, count) => sum + count, 0)); // Calculate total events

        console.log("Series:", values);
        console.log("Labels:", names);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  if (series.length === 0 || labels.length === 0) {
    return <div>No data available to display the chart.</div>;
  }

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const provinceName = labels[dataPointIndex];
        const provinceCount = series[seriesIndex];

        return `<div style="padding: 10px;">
                  <strong>${provinceName}</strong>: ${provinceCount} (${((provinceCount / totalEvents) * 100).toFixed(2)}%)
                </div>`;
      },
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            कार्यक्रमहरुको वितरण
          </h5>
        </div>
        {/* ... other JSX elements ... */}
      </div>

      <div className="mb-2">
        <div
          id="chartThree"
          className="mx-auto flex justify-center"
          style={{ width: "400px", height: "400px" }}
        >
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {labels.map((label, index) => (
          <div key={index} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{
                  backgroundColor:
                    options.colors?.[index % options.colors.length] || "#000",
                }} // Fallback color
              ></span>

              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>
                  {totalEvents > 0
                    ? ((series[index] / totalEvents) * 100).toFixed(2) + "%"
                    : "0%"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
