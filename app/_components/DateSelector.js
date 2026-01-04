"use client";

import { differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useReservation } from "../contexts/ReservationContext";
import { isAlreadyBooked } from "../utils/isAlreadyBooked";

function DateSelector({ settings, bookedDates, cabin }) {
  const { range, handleSelectRange, resetRange } = useReservation();
  const rangeUnavailable = isAlreadyBooked(range, bookedDates);

  const selectedDateRange = rangeUnavailable
    ? { from: undefined, to: undefined }
    : range;

  const { regularPrice, discount, name } = cabin;
  const numNights = differenceInDays(
    selectedDateRange?.to,
    selectedDateRange?.from
  );
  const cabinPrice = regularPrice * numNights - discount;

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={handleSelectRange}
        selected={selectedDateRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        endMonth={new Date(new Date().getFullYear() + 5, 11)}
        disabled={[{ before: new Date() }, ...bookedDates]}
        navLayout="around"
        captionLayout="dropdown"
        numberOfMonths={2}
        timeZone="UTC"
      />

      <div className="flex items-center justify-between gap-4 px-8 bg-accent-500 text-primary-800 h-[72px]">
        {rangeUnavailable ? (
          <span className="font-bold leading-5">
            {`Uh-oh! This cabin (${name}) is unavailable on one or more dates within the selected
            range.`}
          </span>
        ) : (
          <div className="flex items-baseline gap-6">
            <p className="flex gap-2 items-baseline">
              {discount > 0 ? (
                <>
                  <span className="text-2xl">${regularPrice - discount}</span>
                  <span className="line-through font-semibold text-primary-700">
                    ${regularPrice}
                  </span>
                </>
              ) : (
                <span className="text-2xl">${regularPrice}</span>
              )}
              <span className="">/night</span>
            </p>
            {numNights ? (
              <>
                <p className="bg-accent-600 px-3 py-2 text-2xl">
                  <span>&times;</span> <span>{numNights}</span>
                </p>
                <p>
                  <span className="text-lg font-bold uppercase">Total</span>{" "}
                  <span className="text-2xl font-semibold">${cabinPrice}</span>
                </p>
              </>
            ) : null}
          </div>
        )}

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold cursor-pointer hover:bg-accent-400 hover:shadow-lg transition-all duration-100"
            onClick={resetRange}>
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
