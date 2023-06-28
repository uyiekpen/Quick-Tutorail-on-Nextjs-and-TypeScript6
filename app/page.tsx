"use client";
import { HomeProps } from "@/types";
import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/utils";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home({ searchParams }: HomeProps) {
  const [allCars, setallCars] = useState([]);
  const [loading, setloading] = useState(false);

  //search STATES
  const [manufacturer, setmanufacturer] = useState("");
  const [model, setmodel] = useState("");

  //filterStates
  const [fuel, setfuel] = useState("");
  const [year, setyear] = useState(2022);

  //pagination state
  const [limit, setlimit] = useState(10);

  const getCars = async () => {
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2022,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });
      setallCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, manufacturer, model, year, limit]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar setmanufacturer={setmanufacturer} setmodel={setmodel} />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setfuel={setfuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setfilter={setyear}
            />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
            {loading && (
              <div>
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}

            <ShowMore
              pageNumber={(limit || 10) / 10}
              isNext={(limit || 10) > allCars.length}
              setlimit={setlimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            {/* <p>{allCars?.message}</p> */}
          </div>
        )}
      </div>
    </main>
  );
}
