import { getCabins } from "../_lib/data-service";
import CabinCard from "@/app/_components/CabinCard";
import { cacheLife } from "next/cache";

async function CabinsList({ filter }) {
  "use cache";
  cacheLife({ revalidate: 60 * 60, expire: 60 * 90 });

  const cabins = await getCabins();

  if (!cabins.length) return null;

  const filteredCabins = cabins.filter((cabin) => {
    switch (filter) {
      case "small":
        return cabin.maxCapacity <= 3;
      case "medium":
        return cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7;
      case "large":
        return cabin.maxCapacity >= 8;
      default:
        return true;
    }
  });

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinsList;
