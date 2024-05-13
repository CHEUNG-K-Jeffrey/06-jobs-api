import { enableInput, message, token } from "./index.js";
import { showJobs } from "./jobs.js";

export const deleteJob = async (jobId) => {
  if (!jobId) {
    console.error("The Job Id was not found");
    return;
  } else {
    enableInput(false);
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        message.textContent = "The jobs entry was deleted";
        showJobs();
      } else {
        // might happen if the list has been updated since last display
        message.textContent =
          "The jobs entry was not found and could not be deleted";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }
    enableInput(true);
  }
};
