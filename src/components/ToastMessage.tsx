/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Toast } from "./ToastProvider";

import clsx from "clsx";

const VARIANTS = {
  Info: {
    base: "bg-gray-800 bg-opacity-70 border-blue-500",
    iconstyle: "text-blue-500 ",
    name: "Info",
  },

  Error: {
    base: "bg-gray-800 bg-opacity-70  border-red-500 ",
    iconstyle: "text-red-500 ",
    name: "Error",
  },

  Warning: {
    base: "bg-gray-800 bg-opacity-70  border-yellow-500",
    iconstyle: "text-yellow-500 ",
    name: "Warning",
  },

  Success: {
    base: "bg-gray-800 bg-opacity-70  border-green-500",
    iconstyle: "text-green-500 ",
    name: "Success",
  },
};

export type Truncate =
  | "truncate-1-lines"
  | "truncate-2-lines"
  | "truncate-3-lines";

export type ToastMessage = {
  id: string;
  lifetime?: number;
  variant?: keyof typeof VARIANTS | undefined;
  onRemove?: (id: string) => void;
  truncate?: Truncate;
} & Toast;

export default function ToastMessage({
  id,
  header,
  message,
  lifetime,
  onRemove,
  truncate = "truncate-1-lines",
  type,
}: ToastMessage) {
  const Var = type
    ? VARIANTS[type]
    : {
      base: "bg-white border-gray-400 ",
      iconstyle: "",
      name: header,
    };

  useEffect(() => {
    if (lifetime && onRemove) {
      setTimeout(() => {
        onRemove(id);
      }, lifetime);
    }
  }, [lifetime]);

  return (
    <div
      className={clsx(
        "flex w-full visible flex-row shadow-lg",
        "border-l-4 rounded-md duration-100 cursor-pointer",
        "transform transition-all hover:scale-102",
        Var.base,
        type && "max-h-40"
      )}
    >
      <div className="flex flex-row p-2 flex-no-wrap w-full">
        <div className="flex flex-col flex-no-wrap px-1 w-full">
          <div className="flex my-auto font-bold select-none">{Var.name}</div>
          <p
            className={clsx(
              "-mt-0.5 my-auto break-all flex",
              "text-gray-400 text-sm",
              typeof message === "string" && truncate
            )}
          >
            {message}
          </p>
        </div>
        <div
          onClick={() => onRemove && onRemove(id)}
          className={clsx(
            "w-10 h-12 mr-2 items-center mx-auto",
            "text-center leading-none text-lg"
          )}
        >
          <div
            className={clsx(
              "my-auto h-full text-right text-gray-400 hover:text-gray-200",
              "cursor-pointer hover:scale-105 transform "
            )}
          >
            x
          </div>
        </div>
      </div>
    </div>
  );
}
