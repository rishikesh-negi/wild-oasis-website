import { use } from "react";

import { getCabins } from "../_lib/data-service";
import CabinCard from "@/app/_components/CabinCard";

function CabinsList() {
  const cabins = use(getCabins());

  if (!cabins.length) return null;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {cabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinsList;
