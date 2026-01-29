import modalAlert from "./modal-alert";

export default function handleError(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response: {
          data?: { detail?: string };
          status?: number;
          statusText?: string;
        };
      }
    ).response;
    return modalAlert(
      response?.data?.detail ||
        (response?.statusText
          ? `[${response?.status}] ${response?.statusText}`
          : "Something wrong"),
    );
  }
  modalAlert("Something wrong");
}
