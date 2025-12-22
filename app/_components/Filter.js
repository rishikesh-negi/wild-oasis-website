"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams(); // Getting the search params from the URL
  const router = useRouter(); // For navigating to a specific URL
  const pathname = usePathname(); // For getting the current URL path (/cabins in this case)

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams); // Pass search params to the constructor

    // Manipulate the search params (set, delete, etc.):
    params.set("capacity", filter); // This just build the URL internally (no navigation)

    // Use the useRouter hook's replace() function for navigation to the new URL (and prevent implicit scrolling to the top of the navigated page):
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        All cabins
      </Button>
      <Button
        filter="small"
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        4&mdash;7 guests
      </Button>

      <Button
        filter="large"
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 transition-all duration-100 ${
        filter !== activeFilter && "hover:bg-primary-700"
      } ${filter === activeFilter && "bg-accent-600 text-primary-900"}`}
      onClick={() => handleFilter(filter)}>
      {children}
    </button>
  );
}

export default Filter;
