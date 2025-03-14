import { lazy } from "react";
import App from "./App";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LoadingComponent = lazy(async () => {
  await sleep(1000); 
  return { default: App };
});

export default LoadingComponent;


