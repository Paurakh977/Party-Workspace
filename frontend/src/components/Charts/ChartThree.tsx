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
  const [totalEvents, setTotalEvents] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/events/`,
        );

        const provinceData = response.data;

        const provinceCount: Record<string, number> = provinceData.reduce(
          (acc: Record<string, number>, event: Event) => {
            if (event.province) {
              acc[event.province] = (acc[event.province] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        const values = Object.values(provinceCount);
        const names = Object.keys(provinceCount);

        setSeries(values);
        setLabels(names);
        setTotalEvents(values.reduce((sum, count) => sum + count, 0));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  if (series.length === 0 || labels.length === 0) {
    return (
      <div className="col-span-12 rounded-lg border border-stroke bg-white p-5 text-sm text-gray-600 shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-gray-300 xl:col-span-5">
        कुनै डेटा उपलब्ध छैन।
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      toolbar: { show: false },
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#22c55e", "#f59e0b"],
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              label: "जम्मा",
              fontSize: "14px",
              color: "#6b7280",
            },
            value: {
              fontSize: "14px",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark",
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const provinceName = labels[dataPointIndex];
        const provinceCount = series[seriesIndex];
        return `<div style="padding:8px 10px;font-size:12px;">
                  <strong>${provinceName}</strong>: ${provinceCount} (${((provinceCount / totalEvents) * 100).toFixed(1)}%)
                </div>`;
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: { chart: { width: "100%" } },
      },
      {
        breakpoint: 640,
        options: {
          chart: { width: "100%" },
          plotOptions: { pie: { donut: { size: "68%" } } },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark sm:px-6 xl:col-span-5">
      <div className="mb-3 flex items-center justify-between">
        <h5 className="text-base font-semibold text-black dark:text-white">
          कार्यक्रमहरुको वितरण
        </h5>
      </div>

      <div className="mb-3">
        <div id="chartThree" className="mx-auto flex w-full max-w-full justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-2 grid grid-cols-1 gap-y-2 px-2 text-sm sm:grid-cols-2">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className="mr-2 block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    (options.colors && options.colors[index % options.colors.length]) || "#000",
                }}
              ></span>
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {series[index]} ({totalEvents > 0 ? ((series[index] / totalEvents) * 100).toFixed(1) : "0"}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
