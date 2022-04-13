import React, { useState, useEffect } from "react";
import Navbar from "../../../components/layout/Navbar";
import { useRouter } from "next/router";
import axios from "axios";
import Jsona from "jsona";
import { data } from "autoprefixer";

const SalarySetting = () => {
  const router = useRouter();
  const { id } = router.query;
  const dataFormatter = new Jsona();

  const [salarySetting, setSalarySetting] = useState({});

  useEffect(() => {
    const fetchSalarySetting = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings/${id}`,
        { headers: { Authorization: localStorage.token } }
      );

      setSalarySetting(dataFormatter.deserialize(response.data));
    };

    fetchSalarySetting();
  }, []);

  return (
    <>
      <Navbar />
      <div class="flex flex-col container max-w-md mt-10 mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <ul class="flex flex-col divide-y w-full">
          {[
            "ssf_office",
            "ssf_employee",
            "life_insurance_max",
            "ssf_tax_exemption_rate",
            "ssf_tax_exemption_max",
            "from_date",
            "to_date",
          ].map(field => (
            <li class="flex flex-row uppercase h-20">
              <div className="my-auto ml-4 align-middle">
              {field.split("_").join(" ")}: {salarySetting[field]}
                </div>
              </li>
          ))
          }
        </ul>
      </div>
    </>
  );
};

export default SalarySetting;