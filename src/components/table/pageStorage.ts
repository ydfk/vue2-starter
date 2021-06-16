const pageStoreSuffix = "_pagination_current";

export const getPageStore = (key: string): number => {
  try {
    const page = window.localStorage.getItem(`${key}${pageStoreSuffix}`);
    return page ? Number(page) : 0;
  } catch (e) {
    console.log("get table current page number error: ", e);
    return 0;
  }
};

export const setPageStore = (key: string, value: number): void => {
  try {
    window.localStorage.setItem(`${key}${pageStoreSuffix}`, value.toString());
  } catch (e) {
    console.log("set table current page number error: ", e);
  }
};

export const removePageStore = (key: any): void => {
  window.localStorage.removeItem(`${key}${pageStoreSuffix}`);
};

export const refreshPageStore = (keepKey?: any): void => {
  const len = window.localStorage.length;
  for (let i = 0; i < len; i++) {
    const key = window.localStorage.key(i);
    if (key && key.includes(pageStoreSuffix) && key !== `${keepKey}${pageStoreSuffix}`) {
      window.localStorage.removeItem(`${key}`);
    }
  }
};
