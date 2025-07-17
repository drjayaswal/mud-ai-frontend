export async function apiGet<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(
      `GET ${url} failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`,
    {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    }
  );
  if (response.status < 200 && response.status > 300) {
    throw new Error(
      `POST ${url} failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
