import { Keplr, Window as KeplrWin } from "@keplr-wallet/types";

const kWindow: Window & KeplrWin = window;

export const getKeplrFromWindow: () => Promise<Keplr> = async () => {
  if (kWindow.keplr) {
    return kWindow.keplr;
  }

  if (document.readyState === "complete") {
    if (typeof kWindow.keplr === "undefined") {
      throw new Error("keplr undefined");
    } else {
      return kWindow.keplr;
    }
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        if (typeof kWindow.keplr === "undefined") {
          throw new Error("keplr undefined");
        } else {
          resolve(kWindow.keplr);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};
