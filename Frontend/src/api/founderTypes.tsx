export const fetchFounderTypes = async (): Promise<string[]> => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0";

  const response = await fetch(
    "https://engine.eduformacije.com/api/v1/srednje-skole/vrste-osnivaca",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Greška prilikom dohvaćanja podataka o Vrstama osnivača");
  }

  return response.json();
};
