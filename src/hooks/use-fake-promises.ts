import { randomNumberGenerator } from "@/lib/utils";

export function useFakePromises() {
  const randomPromise = async (message : string = "Failed to fetch data - reverted to previous state") => {
    return await new Promise((resolve, reject) => {
      const isSuccess = randomNumberGenerator(1, 10) <= 7;
      setTimeout(() => {
        if (isSuccess) resolve(true);

        reject(new Error(message));
      }, randomNumberGenerator(1, 3) * 1000);
    });
  };

  const alwaysSuccessPromise = async () => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, randomNumberGenerator(1, 3) * 1000);
    });
  };

  const alwaysFailPromise = async (message: string) => {
    return await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, randomNumberGenerator(1, 3) * 1000);
    });
  };

  return {
    randomPromise,
    alwaysSuccessPromise,
    alwaysFailPromise,
  };
}
