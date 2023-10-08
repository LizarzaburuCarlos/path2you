import { STRAPI_URL } from "../core/constants";

interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  method?: string;
  body?: Record<string, any>;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
  method = "GET",
  body,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  let url;

  if (import.meta.env.STRAPI_URL) {
    url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);
  } else if (STRAPI_URL) {
    url = new URL(`${STRAPI_URL}/api/${endpoint}`);
  } else {
    console.error('No se encontró una URL válida');
  }
  
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const requestOptions: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), requestOptions);
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

// export default async function fetchApi<T>({
//   endpoint,
//   query,
//   wrappedByKey,
//   wrappedByList,
// }: Props): Promise<T> {
//   if (endpoint.startsWith('/')) {
//     endpoint = endpoint.slice(1);
//   }

//   const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

//   if (query) {
//     Object.entries(query).forEach(([key, value]) => {
//       url.searchParams.append(key, value);
//     });
//   }
//   const res = await fetch(url.toString());
//   let data = await res.json();

//   if (wrappedByKey) {
//     data = data[wrappedByKey];
//   }

//   if (wrappedByList) {
//     data = data[0];
//   }

//   return data as T;
// }
