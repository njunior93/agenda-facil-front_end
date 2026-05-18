export const getErrorMessage = (error: any): string => {
  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string") return data;

    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }

    if (data?.error) return data.error;

    if (data?.erro) return data.erro;

    return "Erro retornado pelo servidor";
  }

  if (error.request) {
    return "Servidor não respondeu";
  }

  return error.message || "Erro desconhecido";
};
